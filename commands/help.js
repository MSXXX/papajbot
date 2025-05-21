const {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: "help",
  description: "Wyświetla listę dostępnych komend",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("📜 Wyświetla listę dostępnych komend"),
  ownerOnly: false,

  async executePrefix(message, args, client) {
    await sendHelpEmbed(message.author.id, embed => {
      message.reply({ embeds: [embed.embed], components: [embed.row] });
    }, client);
  },

  async execute(interaction, client) {
    await sendHelpEmbed(interaction.user.id, embed => {
      interaction.reply({ embeds: [embed.embed], components: [embed.row], flags: 64 });
    }, client);
  },
};

async function sendHelpEmbed(userId, sendFn, client) {
  const isOwner = userId === config.ownerID;
  const prefix = config.prefix;

  const publicCommands = [];
  const ownerCommands = [];

  for (const [name, cmd] of client.commands) {
    const hasPrefix = typeof cmd.executePrefix === "function";
    const hasSlash = typeof cmd.execute === "function";

    if (!hasPrefix && !hasSlash) continue;

    const description = cmd.description || "*Brak opisu*";
    const formats = [];

    if (hasPrefix) formats.push("`?`");
    if (hasSlash) formats.push("`/`");

    const icons = formats.join(" ");
    const formatted = `• ${icons} **${name}** — ${description}`;

    if (cmd.ownerOnly) {
      if (isOwner) ownerCommands.push(formatted);
    } else {
      publicCommands.push(formatted);
    }
  }

  const embed = new EmbedBuilder()
    .setTitle("📖 Lista komend PapajBota")
    .setColor(0xf1c40f)
    .setDescription("Poniżej znajdziesz dostępne komendy bota.\nUżywaj prefiksu `?` lub komend slash `/`.\n")
    .addFields(
      {
        name: "👥 Publiczne komendy",
        value: publicCommands.length ? publicCommands.join("\n") : "_Brak publicznych komend_",
      },
      ...(isOwner
        ? [{
            name: "🔐 Komendy ownera",
            value: ownerCommands.length ? ownerCommands.join("\n") : "_Brak komend ownera_",
          }]
        : [])
    )
    .setFooter({ text: `Prefix: ${prefix} | discord.gg/papaj` });

  // === Przyciski do zaproszenia i supportu ===
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("➕ Dodaj PapajBota")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/oauth2/authorize?client_id=${config.clientID}&scope=bot%20applications.commands&permissions=8`),

    new ButtonBuilder()
      .setLabel("💬 Support Discord")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/papaj")
  );

  await sendFn({ embed, row });
}
