const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription(`Get info of a member in the server.`)
    .addUserOption(option => option.setName(`user`).setDescription(`the user you want to get info from`).setRequired(false)),
    async execute (interaction, client) {

        const formatter = new Intl.ListFormat(`en-GB`, { style: `narrow`, type: `conjunction` });
        
        //Change the emojis down below
        const badges = {
            BugHunterLevel1: "<:BugHunter1:1380241452117786674>",
            BugHunterLevel2: "<:BugHunter1:1380241452117786674>",
            HypeSquadOnlineHouse1: "<:Bravery:1380241446413795509>",
            HypeSquadOnlineHouse2: "<:Brilliance:1380241449630695514>",
            HypeSquadOnlineHouse3: "<:Balance:1380241443674656778>",
            Hypesquad: "<:m0dE_Hypersquad_VIP:1096798948921987203>",
            Nitro: "",
            Boost: "",
            Partner: "<:Partner:1380241491095588866>",
            PremiumEarlySupporter: "<:EarlySupporter:1380241473399947465>",
            Staff: "<:DiscordStaff:1380241465283838102>",
            VerfiedDeveloper: "<a:Admin:1380441814162477059>",
            ActiveDeveloper: "<:ActiveDeveloper:1380241441070121120>",
        }

        const user = interaction.options.getUser(`user`) || interaction.user;
        const userFlags = user.flags.toArray();
        const member = await interaction.guild.members.fetch(user.id);
        const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, 1)
        const banner = await (await client.users.fetch(user.id, { force: true })).bannerURL({ size: 4096 });
        const booster = member.premiumSince ? `<a:Boosters:1380442657205125191> Yes` : `No`; //Change the emoji
        const ownerE = `<a:LExOWNER:1380442861199167488>`// change the server owner emoji
        const devs = `<a:Admin:1380441814162477059>` // change the bot dev emoji
        const owners = [
            `870179991462236170`, // id for the devs of the bot
        ]
        const MutualServers = []
        const JoinPosition = await interaction.guild.members.fetch().then(Members => Members.sort((a, b) => a.joinedAt - b.joinedAt).map((User) => User.id).indexOf(member.id) + 1)

        for (const Guild of client.guilds.cache.values()) {
            if (Guild.members.cache.has(member.id)) {
                MutualServers.push(`[${Guild.name}](https://discord.com/guilds/${Guild.id})`)
            }
        }

        const bot = new EmbedBuilder() // you can remove this if you want
        .setColor(client.config.embed)
        .setDescription(`Bots are not available`)
        if (member.user.bot) return await interaction.channel.sendTyping(), await interaction.reply({ embeds: [bot]});

        const embed = new EmbedBuilder()
        .setAuthor({ name: `information`, iconURL: member.displayAvatarURL()})
        .setTitle(`**${member.user.tag}**`)
        .setColor(client.config.embed)
        .setThumbnail(member.displayAvatarURL())
        .setDescription(`**Id** - ${member.id}\n• **Boosted** - ${booster}\n• **Top Role** - ${topRoles}\n• **Joined** - <t:${parseInt(member.joinedAt / 1000)}:R>\n• **Discord User** - <t:${parseInt(user.createdAt / 1000)}:R>`)
        .addFields({ name: `Banner`, value: banner ? " " : "None"})
        .setImage(banner)
        .setFooter({ text: `${member ? `Join Position - ${JoinPosition} | ` : ''}Mutual Servers - ${MutualServers.length}`})
        
        // if the member id is equal to server owner
        if (member.id == interaction.guild.ownerId) {
            embed
            .setTitle(`**${member.user.tag}** ${ownerE}`)
        }
        // if the member id is equal to the bot owners
        if (owners.includes(member.id)) {
            embed
            .setTitle(`**${member.user.tag}** ${devs}`)
        }
        // if the member id is equal to server owner and bot owners
        if (owners.includes(member.id) && member.id == interaction.guild.ownerId) {
            embed
            .setTitle(`**${member.user.tag}** ${devs} ${ownerE}`)
        }

        await interaction.reply({ embeds: [embed] });
    }
}