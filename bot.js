const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, prefix } = require('./config.json');
const chalk = require('chalk');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.events = new Collection();

// Załaduj komendy
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Załaduj eventy
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Log po starcie bota
client.once('ready', async () => {
  const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

  const botInfo = `
  ================================                            
  =  ${chalk.cyan.underline(`Nazwa bota: ${client.user.tag}`)}    
  =  ${chalk.cyan.underline(`ID bota: ${client.user.id}`)}        
  =  ${chalk.cyan.underline(`Serwery: ${client.guilds.cache.size}`)}            
  =  ${chalk.cyan.underline(`Użytkownicy: ${totalUsers}`)}        
  =  ${chalk.cyan.underline(`Prefix: ${prefix}`)}                  
  =  ${chalk.cyan.underline(`Komendy: ${client.commands.size}`)}   
  =  ${chalk.cyan.underline(`Eventy: ${client.events.size}`)}      
  ================================
  ${chalk.green(`Bot uruchomiony pomyślnie - ${new Date().toLocaleString()}`)}
  ================================
  `;

  console.log(chalk.green(botInfo));
});

client.login(token);
