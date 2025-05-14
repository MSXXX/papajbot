const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const jokesData = require('../api/zarty.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zart')
    .setDescription('Odbierz papajowy żart, który rozświetli Twój dzień ✨'),

  async execute(interaction) {
    const jokes = jokesData.jokes;

    if (!Array.isArray(jokes) || jokes.length === 0) {
      return interaction.reply({
        content: '😢 Ups! Papaj nie ma dziś żartów do opowiedzenia.',
        ephemeral: true
      });
    }

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

    const titles = [
      '😇 Papaj rzekł:',
      '📖 Mądrość z nieba:',
      '✨ Papieski żart dnia:',
      '🙏 Z papieskiego zeszytu:',
      '🕊️ Święty suchar:'
    ];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];

    const embed = new EmbedBuilder()
      .setTitle(randomTitle)
      .setDescription(`**${randomJoke}**`)
      .setColor('#FFD700')
      .setFooter({ text: 'discord.gg/papaj • 2137', iconURL: 'https://cdn-icons-png.flaticon.com/512/1154/1154464.png' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
