const { EmbedBuilder } = require("discord.js");
const { ownerID } = require("../config.json"); // Dodaj do config.json swoje ID jako ownerId

module.exports = {
  name: "uptime",
  description: "Pokazuje czas działania bota",
  async execute(interaction, client) {
    if (interaction.user.id !== ownerID) {
      return interaction.reply({ content: "Nie masz dostępu do tej komendy.", ephemeral: true });
    }

    const uptimeMs = client.uptime;
    const seconds = Math.floor((uptimeMs / 1000) % 60);
    const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
    const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("Uptime bota")
      .setDescription(`Bot działa od: **${uptimeString}**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },

  async executePrefix(message, args, client) {
    if (message.author.id !== ownerID) {
      return message.reply("Nie masz dostępu do tej komendy.");
    }

    const uptimeMs = client.uptime;
    const seconds = Math.floor((uptimeMs / 1000) % 60);
    const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
    const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("Uptime bota")
      .setDescription(`Bot działa od: **${uptimeString}**`)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
