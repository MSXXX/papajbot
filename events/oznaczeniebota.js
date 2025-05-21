module.exports = {
  name: 'messageCreate',
  execute(message) {
    // Ignoruj wiadomości od botów
    if (message.author.bot) return;

    // Sprawdź, czy bot został oznaczony
    if (message.mentions.has(message.client.user)) {
      message.reply('<:hejkotku:1370790418475646986>');
    }
  }
};
