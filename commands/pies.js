const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "pies",
  aliases: ["dog"],
  description: "Wyświetla losowego psa!",
  data: new SlashCommandBuilder()
    .setName("pies")
    .setDescription("🐶 Wyświetla losowego psa!"),

  async execute(interaction) {
    try {
      const res = await fetch("https://api.thedogapi.com/v1/images/search");
      const data = await res.json();
      if (!data || !data[0] || !data[0].url) {
        return interaction.reply({ content: "Nie udało się pobrać zdjęcia psa.", ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setDescription("🐶 Woof!")
        .setImage(data[0].url)
        .setColor("#00BFFF")
        .setFooter({ text: "discord.gg/papaj" });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Błąd przy pobieraniu psa:", error);
      await interaction.reply({ content: "Wystąpił błąd podczas pobierania psa.", ephemeral: true });
    }
  },

  async executePrefix(message, args) {
    try {
      const res = await fetch("https://api.thedogapi.com/v1/images/search");
      const data = await res.json();
      if (!data || !data[0] || !data[0].url) {
        return message.reply("Nie udało się pobrać zdjęcia psa.");
      }

      const embed = new EmbedBuilder()
        .setDescription("🐶 Woof!")
        .setImage(data[0].url)
        .setColor("#00BFFF")
        .setFooter({ text: "discord.gg/papaj" });

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Błąd przy pobieraniu psa:", error);
      message.reply("Wystąpił błąd podczas pobierania psa.");
    }
  },
};
