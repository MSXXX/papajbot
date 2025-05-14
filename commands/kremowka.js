const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'kremowka',
    description: 'Wyślij pyszna kremówkę!',
    options: [
      {
        type: 6, // Typ opcji - użytkownik
        name: 'użytkownik',
        description: 'Wybierz użytkownika, któremu wyślesz kremówkę',
        required: true,
      },
      {
        type: 3, // Typ opcji - string
        name: 'tekst',
        description: 'Opcjonalny tekst do wysłania',
        required: false,
      },
    ],
  },
  async execute(interaction) {
    const targetUser = interaction.options.getUser('użytkownik');
    const text = interaction.options.getString('tekst') || '';
    
    // Jeśli ktoś chce wysłać kremówkę samemu sobie
    if (targetUser.id === interaction.user.id) {
      return interaction.reply({ content: 'Samemu sobie chcesz wysyłać kremówki? Trochę słabo...', ephemeral: true });
    }

    // Wysyłanie wiadomości, że trwa wysyłanie kremówki
    await interaction.reply({ content: 'Trwa wysyłanie kremówki...', ephemeral: true });

    // Tworzenie embeda z kremówką
    const kremowkaEmbed = new MessageEmbed()
      .setColor('#F5A9A9')
      .setTitle('Pyszna Kremówka!')
      .setDescription(`🎂 **Kremówka dla Ciebie, ${targetUser.tag}!** 🍰`)
      .addField('Opcjonalna wiadomość:', text ? text : 'Brak tekstu.')
      .setImage('attachment://kremowka.png') // Przykładowy obrazek kremówki
      .setFooter('Kremówka wysłana przez: ' + interaction.user.tag);

    // Wysyłanie wiadomości prywatnej do użytkownika
    try {
      const attachment = new MessageAttachment('/mnt/data/338d289e-ca56-49ba-a68d-7f1ccd06f702.png', 'kremowka.png');
      await targetUser.send({ embeds: [kremowkaEmbed], files: [attachment] });
      
      // Dodawanie przycisku "Podziękuj"
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('thank_you_button')
          .setLabel('Podziękuj')
          .setStyle('PRIMARY')
      );

      // Wysyłanie wiadomości z przyciskiem do użytkownika, który wysłał kremówkę
      await interaction.followUp({ 
        content: `${targetUser.tag} dostał(a) kremówkę! Dziękujemy za wysłanie!`, 
        components: [row],
        ephemeral: true 
      });
    } catch (error) {
      console.error('Błąd wysyłania wiadomości:', error);
      return interaction.followUp({ content: 'Wystąpił problem podczas wysyłania kremówki, spróbuj ponownie później.', ephemeral: true });
    }
  },
};
