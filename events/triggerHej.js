module.exports = {
  name: 'messageCreate',
  execute(message) {
    // Ignoruj wiadomości od botów
    if (message.author.bot) return;

    // Trigger (możesz go zmienić na dowolny inny)
    const trigger = 'hej';

    if (message.content.toLowerCase().includes(trigger)) {
      message.reply('<:hejkotku:1370790418475646986>');
    }
  }
};
