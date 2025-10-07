const {
  Events,
  Guilds,
  Client,
  EmbedBuilder,
  ChannelType,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  name: "guildCreate",
  once: false,
  async execute(guild, client) {
    const channel = guild.channels.cache
      .filter((c) => c.type === ChannelType.GuildText)
      .sort((a, b) => a.rawPosition - b.rawPosition || a.id - b.id)
      .first();
    if (!channel) return;

    const but = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Support")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/codexdev"),

      new ButtonBuilder()
        .setLabel("Vote")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/codexdev")
    );

    const emb = new EmbedBuilder()
      .addFields({
        name: "Guidelines",
        value:
          "> • I am only running on **slash commands**. <:download:1380241468169654495>\n> • Find my all commands by using </help:1087992591741624351> command. \n> • Use </bot report-bug:1234> if you found any **bug**. \n\n🎟️ **If you need any help feel free to join our support server**. \n⚠️ **Make sure to give my required permissions.**",
        inline: false,
      })
      .setDescription(
        "**Advanced futuristic discord bot with many amazing high functional features like MiniGames, Giveaways, Counting system and many more.**"
      )
      .setAuthor({ name: "❤️ Thanks for adding me!" })
      .setTitle("Hi, I am AIO v4 | Evolution X")
      .setFooter({ text: "#KeepEvolving" })
      .setTimestamp()
      .setColor(client.config.embed);

    channel.send({ embeds: [emb], components: [but] });
  },
};
