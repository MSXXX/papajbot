const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  name: "kremowka",
  description: "Wyślij kremówkę wybranemu użytkownikowi.",
  data: new SlashCommandBuilder()
    .setName("kremowka")
    .setDescription("🎂 Wyślij kremówkę wybranemu użytkownikowi.")
    .addUserOption(option =>
      option
        .setName("użytkownik")
        .setDescription("Komu chcesz podarować kremówkę?")
        .setRequired(true)
    ),
  ownerOnly: false,

  async execute(interaction) {
    const sender = interaction.user;
    const target = interaction.options.getUser("użytkownik");

    if (!target || target.bot) {
      return interaction.reply({
        content: "Nie można wysłać kremówki botowi.",
      });
    }

    if (sender.id === target.id) {
      return interaction.reply({
        content: "Samemu sobie chcesz wysyłać kremówki? Trochę słabo...",
      });
    }

    await interaction.reply(`Trwa wysyłanie kremówki <a:kremowkaobrot:1372022114688958705>`);

    const embed = new EmbedBuilder()
      .setTitle("🎂 Kremówka od PapajBota!")
      .setDescription(`${sender} podarował Ci kremówkę! 🥳`)
      .setColor("#FAD6A5")
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/icons/1369683481856315463/e7d72388fa8b55407d9b8277b2b912a7.png?size=4096");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`thanks_${sender.id}`)
        .setLabel("❤ Podziękuj")
        .setStyle(ButtonStyle.Primary)
    );

    try {
      await target.send({ embeds: [embed], components: [row] });
      await interaction.channel.send(
        `Kremówka została dostarczona do **${target.username}**. 🎁`
      );
    } catch {
      return interaction.channel.send(
        "Nie udało się wysłać kremówki, użytkownik może mieć zablokowane DM."
      );
    }
  },

  async executePrefix(message, args) {
    const sender = message.author;

    let target =
      message.mentions.users.first() ||
      (args[0] && (await message.client.users.fetch(args[0]).catch(() => null)));

    if (!target) {
      const usageEmbed = new EmbedBuilder()
        .setTitle("❌ Błąd")
        .setDescription("Musisz oznaczyć użytkownika **lub podać jego ID**!")
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter({ text: "PapajBot - kremówkowa misja" });

      return message.reply({ embeds: [usageEmbed] });
    }

    if (target.bot) {
      return message.reply("Nie można wysłać kremówki botowi.");
    }

    if (sender.id === target.id) {
      return message.reply("Samemu sobie chcesz wysyłać kremówkę? Trochę słabo...");
    }

    await message.reply("Trwa wysyłanie kremówki <a:kremowkaobrot:1372022114688958705>");

    const embed = new EmbedBuilder()
      .setTitle("🎂 Kremówka od PapajBota!")
      .setDescription(`${sender} podarował Ci kremówkę! 🥳`)
      .setColor("#FAD6A5")
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/icons/1369683481856315463/e7d72388fa8b55407d9b8277b2b912a7.png?size=4096");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`thanks_${sender.id}`)
        .setLabel("Podziękuj")
        .setStyle(ButtonStyle.Primary)
    );

    try {
      await target.send({ embeds: [embed], components: [row] });
      await message.channel.send(
        `Kremówka została dostarczona do **${target.username}**. 🎁`
      );
    } catch {
      return message.channel.send(
        "Nie udało się wysłać kremówki, użytkownik może mieć zablokowane DM."
      );
    }
  },
};