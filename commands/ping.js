const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Sprawdź opóźnienie bota!'),
  async execute(interaction) {
    await interaction.reply(`🏓 Pong! Opóźnienie: ${Date.now() - interaction.createdTimestamp}ms`);
  },
};
