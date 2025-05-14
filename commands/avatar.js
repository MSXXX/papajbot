const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Pokaż avatar i banner użytkownika!')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Wybierz użytkownika, którego avatar chcesz zobaczyć')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    // Pobranie użytkownika - jeśli nie podano, weź użytkownika, który wykonał komendę
    const user = interaction.options.getUser('user') || interaction.user;

    // Fetchujemy użytkownika, aby uzyskać pełne dane (w tym baner)
    await user.fetch();

    // Przygotowanie embed z avatarem
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle(`Avatar użytkownika ${user.username}`)
      .setDescription(`ID: ${user.id}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 })) // Mniejszy rozmiar thumbnail, ale większy avatar w głównym widoku
      .setFooter({ text: `Użyte przez: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 32 }) });

    // Ustawienie większego avatara
    embed.setImage(user.displayAvatarURL({ dynamic: true, size: 512 })); // Avatar w większym rozmiarze

    // Próba dodania banera, jeśli dostępny
    const bannerUrl = user.bannerURL({ size: 1024 });
    if (bannerUrl) {
      embed.setImage(bannerUrl); // Ustawienie większego banera
    } else {
      embed.addFields({ name: 'Brak banera', value: 'Użytkownik nie ma banera.' });
    }

    // Wysłanie embed w odpowiedzi
    await interaction.reply({ embeds: [embed] });
  },
};
