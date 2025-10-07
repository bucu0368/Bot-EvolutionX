const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ChannelType,
    GuildVerificationLevel,
    GuildExplicitContentFilter,
    GuildNSFWLevel,
    SlashCommandBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("serverinfo")
      .setDescription("Displays information about the server."),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const { guild } = interaction;
      const { members, channels, emojis, roles, stickers } = guild;
  
      const sortedRoles = roles.cache
        .map((role) => role)
        .slice(1, roles.cache.size)
        .sort((a, b) => b.position - a.position);
      const userRoles = sortedRoles.filter((role) => !role.managed);
      const managedRoles = sortedRoles.filter((role) => role.managed);
      const botCount = members.cache.filter((member) => member.user.bot).size;
  
      const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
        let totalLength = 0;
        const result = [];
  
        for (const role of roles) {
          const roleString = `<@&${role.id}>`;
  
          if (roleString.length + totalLength > maxFieldLength) break;
  
          totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
          result.push(roleString);
        }
  
        return result.length;
      };
  
      const splitPascal = (string, separator) =>
        string.split(/(?=[A-Z])/).join(separator);
      const toPascalCase = (string, separator = false) => {
        const pascal =
          string.charAt(0).toUpperCase() +
          string
            .slice(1)
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
        return separator ? splitPascal(pascal, separator) : pascal;
      };
  
      const getChannelTypeSize = (type) =>
        channels.cache.filter((channel) => type.includes(channel.type)).size;
  
      const totalChannels = getChannelTypeSize([
        ChannelType.GuildText,
        ChannelType.GuildNews,
        ChannelType.GuildVoice,
        ChannelType.GuildStageVoice,
        ChannelType.GuildForum,
        ChannelType.GuildPublicThread,
        ChannelType.GuildPrivateThread,
        ChannelType.GuildNewsThread,
        ChannelType.GuildCategory,
      ]);
  
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(members.me.roles.highest.hexColor)
            .setTitle(`${guild.name}'s Information`)
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .setImage(guild.bannerURL({ size: 1024 }))
            .addFields(
              { name: "Description", value: `📝 ${guild.description || "None"}` },
              {
                name: "General",
                value: [
                  `<:data:1380241459797819495> **Created** <t:${parseInt(
                    guild.createdTimestamp / 1000
                  )}:R>`,
                  `<:i_:1379481795388637265> **ID** \`${guild.id}\``,
                  `<:Hypesquad:1380241475685842974> **Owner** <@${guild.ownerId}>`,
                  `<:lang:1380241485458309180> **Language** \`${new Intl.DisplayNames(
                    ["en"],
                    {
                      type: "language",
                    }
                  ).of(guild.preferredLocale)}\``,
                  `<:lock:1379911561791017040> **Vanity URL** ${
                    guild.vanityURLCode || "None"
                  }`,
                ].join("\n"),
              },
              {
                name: "Features",
                value:
                  guild.features
                    ?.map((feature) => `- ${toPascalCase(feature, " ")}`)
                    ?.join("\n") || "None",
                inline: true,
              },
              {
                name: "Security",
                value: [
                  `<:dot:1379911309683986432> **Explicit Filter** \`${splitPascal(
                    GuildExplicitContentFilter[guild.explicitContentFilter],
                    " "
                  )}\``,
                  `<:dot:1379911309683986432> **NSFW Level** \`${splitPascal(
                    GuildNSFWLevel[guild.nsfwLevel],
                    " "
                  )}\``,
                  `<:dot:1379911309683986432> **Verification Level** \`${splitPascal(
                    GuildVerificationLevel[guild.verificationLevel],
                    " "
                  )}\``,
                ].join("\n"),
                inline: true,
              },
              {
                name: `Users (\`${guild.memberCount}\`)`,
                value: [
                  `<:members:1379911597941854340> **Members** \`${
                    guild.memberCount - botCount
                  }\``,
                  `<:bot:1379911631970111558> **Bots** \`${botCount}\``,
                ].join("\n"),
                inline: true,
              },
              {
                name: `User Roles (${maxDisplayRoles(userRoles)} of ${
                  userRoles.length
                })`,
                value: `${
                  userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") ||
                  "None"
                }`,
              },
              {
                name: `Managed Roles (${maxDisplayRoles(managedRoles)} of ${
                  managedRoles.length
                })`,
                value: `${
                  managedRoles
                    .slice(0, maxDisplayRoles(managedRoles))
                    .join(" ") || "None"
                }`,
              },
              {
                name: `Channels, Threads & Categories (${totalChannels})`,
                value: [
                  `<:thread:1379911914003628062> **Text** \`${getChannelTypeSize(
                    [
                      ChannelType.GuildText,
                      ChannelType.GuildForum,
                      ChannelType.GuildNews,
                    ]
                  )}\``,
                  `<:vol:1379911824631140494> **Voice** \`${getChannelTypeSize([
                    ChannelType.GuildVoice,
                    ChannelType.GuildStageVoice,
                  ])}\``,
                  `<:dot:1379911309683986432> **Threads** \`${getChannelTypeSize(
                    [
                      ChannelType.GuildPublicThread,
                      ChannelType.GuildPrivateThread,
                      ChannelType.GuildNewsThread,
                    ]
                  )}\``,
                  `<:dot:1379911309683986432> **Categories** \`${getChannelTypeSize(
                    [ChannelType.GuildCategory]
                  )}\``,
                ].join("\n"),
                inline: true,
              },
              {
                name: `Emojis & Stickers (${
                  emojis.cache.size + stickers.cache.size
                })`,
                value: [
                  `<:dot:1379911309683986432> **Animated** ${
                    emojis.cache.filter((emoji) => emoji.animated).size
                  }`,
                  `<:dot:1379911309683986432> **Static** ${
                    emojis.cache.filter((emoji) => !emoji.animated).size
                  }`,
                  `<:dot:1379911309683986432> **Stickers** ${stickers.cache.size}`,
                ].join("\n"),
                inline: true,
              },
              {
                name: "Nitro",
                value: [
                  `<:boost:1379911961231229069> **Tier** ${
                    guild.premiumTier || "None"
                  }`,
                  `<:boost:1379911961231229069> **Boosts** ${guild.premiumSubscriptionCount}`,
                  `<:boost:1379911961231229069> **Boosters** ${
                    guild.members.cache.filter(
                      (member) => member.roles.premiumSubscriberRole
                    ).size
                  }`,
                  `<:boost:1379911961231229069> **Total Boosters** ${
                    guild.members.cache.filter((member) => member.premiumSince)
                      .size
                  }`,
                ].join("\n"),
                inline: true,
              },
              { name: "Banner", value: guild.bannerURL() ? "** **" : "None" }
            ),
        ],
        ephemeral: false,
      });
    },
  };
  