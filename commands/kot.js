const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "kot",
  aliases: ["cat"],
  description: "Wyświetla losowego kota!",
  data: new SlashCommandBuilder()
    .setName("kot")
    .setDescription("🐱 Wyświetla losowego kota!"),

  async execute(interaction) {
    try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await res.json();
      if (!data || !data[0] || !data[0].url) {
        return interaction.reply({ content: "Nie udało się pobrać zdjęcia kota.", ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setDescription("🐱 Meow..")
        .setImage(data[0].url)
        .setColor("#FFA500")
        .setFooter({ text: "discord.gg/papaj" });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Błąd przy pobieraniu kota:", error);
      await interaction.reply({ content: "Wystąpił błąd podczas pobierania kota.", ephemeral: true });
    }
  },

  async executePrefix(message, args) {
    try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await res.json();
      if (!data || !data[0] || !data[0].url) {
        return message.reply("Nie udało się pobrać zdjęcia kota.");
      }

      const embed = new EmbedBuilder()
        .setDescription("🐱 Meow..")
        .setImage(data[0].url)
        .setColor("#FFA500")
        .setFooter({ text: "discord.gg/papaj" });

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Błąd przy pobieraniu kota:", error);
      message.reply("Wystąpił błąd podczas pobierania kota.");
    }
  },
};
