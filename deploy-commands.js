const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (
    command.data &&
    typeof command.data.toJSON === 'function'
  ) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️  Komenda "${file}" nie została załadowana - brak poprawnego exportu "data: SlashCommandBuilder".`);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

// Zarejestruj globalne komendy (na wszystkich serwerach)
(async () => {
  try {
    console.log('🔁 Rejestruję (lub aktualizuję) slash-komendy globalnie...');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log('✅ Pomyślnie zarejestrowano slash-komendy globalnie!');
  } catch (error) {
    console.error('❌ Błąd podczas rejestracji komend:', error);
  }
})();
