const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { guildId } = require('../config.json');  // Zakładając, że masz plik config.json z guildId

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Pobiera informacje o serwerze, na którym komenda jest wywoływana.'),
    async execute(interaction) {
        // Pobierz dane serwera z interaction.guild
        const guild = interaction.guild;

        // Sprawdzenie, czy serwer ma banner
        const bannerURL = guild.bannerURL({ size: 1024 }) || 'Brak banera';
        const iconURL = guild.iconURL({ size: 1024 }) || 'Brak ikony';

        // Tworzenie embed'a
        const serverEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Informacje o serwerze: ${guild.name}`)
            .setThumbnail(iconURL)
            .addFields(
                { name: 'ID Serwera', value: guild.id, inline: true },
                { name: 'Właściciel', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Data utworzenia', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Liczba członków', value: `${guild.memberCount}`, inline: true },
                { name: 'Liczba ról', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Liczba kanałów', value: `${guild.channels.cache.size}`, inline: true }
            )
            .setImage(bannerURL) // Banner serwera
            .setFooter({ text: 'PapajBot • discord.gg/papaj' })
            .setTimestamp();

        // Wyślij odpowiedź
        await interaction.reply({ embeds: [serverEmbed] });
    },
};
