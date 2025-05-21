const { EmbedBuilder } = require("discord.js");
const config = require("../config.json"); // Dodaj import config

module.exports = {
  name: "ship",
  description: "Zrób parę i sprawdź papieskie % dopasowania dwóch użytkowników.",
  options: [
    {
      name: "użytkownik1",
      type: 6, // USER type
      description: "Pierwszy użytkownik",
      required: true,
    },
    {
      name: "użytkownik2",
      type: 6,
      description: "Drugi użytkownik",
      required: true,
    },
  ],

  // Slash command
  async execute(interaction) {
    const user1 = interaction.options.getUser("użytkownik1");
    const user2 = interaction.options.getUser("użytkownik2");

    if (user1.id === user2.id) {
      return interaction.reply({ content: "Nie możesz tworzyć pary z samym sobą! 🙃", ephemeral: true });
    }

    // Losowe dopasowanie 0-100%
    const lovePercent = Math.floor(Math.random() * 101);

    // Papieski teksty na wynik
    const messages = [
      `Papież Franciszek błogosławi tę parę! 🙏`,
      `To miłość jak z 2137! 🔥`,
      `Ten związek jest błogosławiony przez samego papamobile! 🚗💨`,
      `Proroctwo mówi, że ta para podbije serca świata! 🌍❤️`,
      `Bądźcie razem jak pierogi i śmietana - idealni! 🥟✨`,
      `Nawet Aniołowie patrzą na was z zazdrością! 😇`,
      `Wasza miłość jest silniejsza niż wszelkie memy! 😂❤️`,
      `Papież przyśle Wam swoją łaskę i trochę papajowych mocy! ⚡🍕`,
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];

    const embed = new EmbedBuilder()
      .setTitle("💞 Papieskie Shipowanie 💞")
      .setDescription(`${user1} ❤️ ${user2}`)
      .addFields(
        { name: "Dopasowanie", value: `${lovePercent}%`, inline: true },
        { name: "Proroctwo", value: message }
      )
      .setColor("#ff0000")
      .setFooter({ text: "PapajBot - miłość w stylu 2137" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },

  // Prefix command
  async executePrefix(message, args) {
    if (args.length < 2) {
      const usageEmbed = new EmbedBuilder()
        .setTitle("❌ Niepoprawne użycie komendy")
        .setDescription(`Poprawne użycie:\n\`${config.prefix}ship <użytkownik1> <użytkownik2>\``)
        .setColor("#ff0000")
        .setFooter({ text: "PapajBot - miłość w stylu 2137" })
        .setTimestamp();

      return message.reply({ embeds: [usageEmbed] });
    }

    // Pobierz użytkowników z wiadomości
    const user1 = message.mentions.users.first();
    const user2 = message.mentions.users.last();

    if (!user1 || !user2) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ Niepoprawne użycie komendy")
        .setDescription("Musisz oznaczyć dwóch użytkowników!")
        .setColor("#ff0000")
        .setFooter({ text: "PapajBot - miłość w stylu 2137" })
        .setTimestamp();

      return message.reply({ embeds: [errorEmbed] });
    }

    if (user1.id === user2.id) {
      return message.reply("Nie możesz tworzyć pary z samym sobą! 🙃");
    }

    const lovePercent = Math.floor(Math.random() * 101);

    const messages = [
      `Papież Franciszek błogosławi tę parę! 🙏`,
      `To miłość jak z 2137! 🔥`,
      `Ten związek jest błogosławiony przez samego papamobile! 🚗💨`,
      `Proroctwo mówi, że ta para podbije serca świata! 🌍❤️`,
      `Bądźcie razem jak pierogi i śmietana - idealni! 🥟✨`,
      `Nawet Aniołowie patrzą na was z zazdrością! 😇`,
      `Wasza miłość jest silniejsza niż wszelkie memy! 😂❤️`,
      `Papież przyśle Wam swoją łaskę i trochę papajowych mocy! ⚡🍕`,
    ];
    const messageText = messages[Math.floor(Math.random() * messages.length)];

    const embed = new EmbedBuilder()
      .setTitle("💞 Papieskie Shipowanie 💞")
      .setDescription(`${user1} ❤️ ${user2}`)
      .addFields(
        { name: "Dopasowanie", value: `${lovePercent}%`, inline: true },
        { name: "Proroctwo", value: messageText }
      )
      .setColor("#ff0000")
      .setFooter({ text: "PapajBot - miłość w stylu 2137" })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};