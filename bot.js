const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const chalk = require("chalk");
const { token, prefix } = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,       // POTRZEBNE do ról
    GatewayIntentBits.GuildPresences,     // POTRZEBNE do statusów
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.User, Partials.GuildMember]
});

client.commands = new Collection();
client.events = new Collection();

// === ŁADOWANIE KOMEND ===
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  try {
    const command = require(`./commands/${file}`);
    const commandName = command.name || (command.data && command.data.name);
    if (!commandName) {
      console.error(`❌ komenda z pliku ${file} nie została załadowana (brak name lub data.name)`);
      continue;
    }
    client.commands.set(commandName, command);
  } catch (err) {
    console.error(`❌ komenda z pliku ${file} nie została załadowana:`, err.message);
  }
}

// === ŁADOWANIE EVENTÓW ===
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
let loadedEvents = 0;

for (const file of eventFiles) {
  try {
    const event = require(`./events/${file}`);
    if (!event.name || !event.execute) {
      console.error(`❌ event z pliku ${file} nie został załadowany (brak name lub execute)`);
      continue;
    }
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    client.events.set(event.name, event);
    loadedEvents++;
  } catch (err) {
    console.error(`❌ event z pliku ${file} nie został załadowany:`, err.message);
  }
}

// === OBSŁUGA KOMEND PREFIKSOWYCH ===
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (typeof command.executePrefix === "function") {
    try {
      await command.executePrefix(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply("Wystąpił błąd podczas wykonywania komendy.");
    }
  } else {
    message.reply("Ta komenda nie obsługuje komend prefixowych.");
  }
});

// === OBSŁUGA KOMEND SLASH ===
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  if (typeof command.execute === "function") {
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply("Wystąpił błąd podczas wykonywania komendy.");
      } else {
        await interaction.reply({ content: "Wystąpił błąd podczas wykonywania komendy.", ephemeral: true });
      }
    }
  }
});

// === POŁĄCZENIE I LOGI ===
client.once("ready", async () => {
  const totalUsers = client.guilds.cache.reduce(
    (acc, guild) => acc + guild.memberCount, 0
  );

  const botInfo = `
  ================================
  =  ${chalk.cyan.underline(`Nazwa bota: ${client.user.tag}`)}    
  =  ${chalk.cyan.underline(`ID bota: ${client.user.id}`)}        
  =  ${chalk.cyan.underline(`Serwery: ${client.guilds.cache.size}`)}            
  =  ${chalk.cyan.underline(`Użytkownicy: ${totalUsers}`)}        
  =  ${chalk.cyan.underline(`Prefix: ${prefix}`)}                  
  =  ${chalk.cyan.underline(`Komendy: ${client.commands.size}`)}   
  =  ${chalk.cyan.underline(`Eventy: ${loadedEvents}`)}      
  ================================
  ${chalk.green(`PapajBot uruchomiony pomyślnie - ${new Date().toLocaleString()}`)}
  ================================
  `;

  console.log(botInfo);
});

client.login(token);