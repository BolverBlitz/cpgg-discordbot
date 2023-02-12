const {EmbedBuilder} = require('discord.js');
const {primaryColor} = require('../config')
const relativeTime = require('dayjs/plugin/relativeTime')
const dayjs = require('dayjs')

module.exports = function (userResult, userData, interaction) {
    dayjs.extend(relativeTime)
    let registeredAt = dayjs(userData.created_at).fromNow()

    return new EmbedBuilder()
        .setTitle(`Information: ${userData.name} (${interaction.user.username})`)
        .setDescription('-------------------------------------------')
        .addFields(
            {name: 'Name', value: `\`${userData.name}\``, inline: true},
            {name: 'Role', value: `\`${userData.role}\``, inline: true},
            {name: 'Credits', value: `\`$${(Math.round(userData.credits * 100) / 100).toString()}\``, inline: true},
            {name: 'Servers', value: ` \`${userData.servers_count} Out of ${userData.server_limit}\``, inline: true},
            {name: 'Vouchers', value: `\`Claimed ${userData.vouchers_count}\``, inline: true},
            {name: 'Verified', value: `\`${userData.email_verified_at ? 'Email' : ''}${userData.discord_verified_at ? ', Discord' : ''}\``, inline: true},
            {name: 'Registered', value: `\`${registeredAt}\``, inline: false},
        )
        .setThumbnail(interaction.member.user.displayAvatarURL())
        .setFooter({
            text: `${userResult.cached ? 'cached |' : ''} command: /me`,
            iconURL: interaction.user.displayAvatarURL(),
          })
}