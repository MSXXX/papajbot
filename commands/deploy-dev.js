      const { REST, Routes, EmbedBuilder } = require("discord.js");
      const fs = require("fs");
      const config = require("../config.json");

      module.exports = {
        name: "deploy-dev",
        description: "Rejestruje komendy tylko na serwerze deweloperskim",
        ownerOnly: true,

        async executePrefix(message, args, client) {
          if (String(message.author.id) !== String(config.ownerID)) {
            return message.reply("❌ Nie masz uprawnień do użycia tej komendy.");
          }

          const commands = [];
          const commandNames = new Set();
          const emojiRegex = /[\p{Emoji}]/u;

          const commandFiles = fs
            .readdirSync("./commands")
            .filter(file => file.endsWith(".js"));

          for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            if (
              command.data &&
              typeof command.data.name === "string" &&
              typeof command.data.description === "string"
            ) {
              const name = command.data.name;

              if (!emojiRegex.test(command.data.description)) {
                console.log(`⏭️ Pominięto "${name}" — brak emoji w opisie.`);
                continue;
              }

              if (commandNames.has(name)) {
                console.log(`⛔ Duplikat "${name}" — pominięto.`);
                continue;
              }

              commandNames.add(name);
              commands.push(command.data.toJSON());
            }
          }

          const rest = new REST({ version: "10" }).setToken(config.token);

          try {
            const existingCommands = await rest.get(
              Routes.applicationGuildCommands(config.clientID, config.guildID)
            );

            // Usuń zdublowane komendy bez emoji
            const grouped = {};
            for (const cmd of existingCommands) {
              if (!grouped[cmd.name]) grouped[cmd.name] = [];
              grouped[cmd.name].push(cmd);
            }

            const toDelete = [];
            for (const [name, variants] of Object.entries(grouped)) {
              if (variants.length <= 1) continue;

              const withEmoji = variants.find(v => emojiRegex.test(v.description));
              const withoutEmoji = variants.filter(v => !emojiRegex.test(v.description));

              if (withEmoji && withoutEmoji.length) {
                for (const v of withoutEmoji) {
                  toDelete.push(v);
                }
              }
            }

            for (const cmd of toDelete) {
              await rest.delete(
                Routes.applicationGuildCommand(config.clientID, config.guildID, cmd.id)
              );
              console.log(`🗑️ Usunięto zdublowaną komendę bez emoji: ${cmd.name}`);
            }

            // Porównanie obecnych i nowych komend
            const newCommandsJSON = JSON.stringify(commands);
            const existingCommandsJSON = JSON.stringify(
              existingCommands
                .filter(cmd => emojiRegex.test(cmd.description))
                .map(cmd => ({
                  name: cmd.name,
                  description: cmd.description,
                  options: cmd.options || [],
                }))
            );

            if (newCommandsJSON === existingCommandsJSON && toDelete.length === 0) {
              return message.reply("ℹ️ Brak zmian — komendy już są aktualne.");
            }

            await rest.put(
              Routes.applicationGuildCommands(config.clientID, config.guildID),
              { body: commands }
            );

            const embed = new EmbedBuilder()
              .setColor("Green")
              .setTitle("✅ Komendy zarejestrowane")
              .setDescription(
                `Zarejestrowano **${commands.length}** komend.\nUsunięto **${toDelete.length}** duplikatów bez emoji.`
              )
              .setFooter({ text: "Deploy zakończony sukcesem" });

            await message.reply({ embeds: [embed] });
          } catch (error) {
            console.error("❌ Błąd podczas rejestracji komend:", error);
            await message.reply("❌ Wystąpił błąd podczas rejestracji komend.");
          }
        },
      };
