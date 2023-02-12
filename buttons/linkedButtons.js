const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

/**
 * @param {array} details (name and url)
 * @return {Promise<MessageActionRow>}
 */
module.exports = async function (details) {
    return new Promise((resolve, reject) => {
        try {
            let buttons = details.map(detail => {
                return new ButtonBuilder()
                    .setLabel(detail.name)
                    .setURL(detail.url)
                    .setStyle(5)
            })

            let messageActionRow = new ActionRowBuilder()
                .addComponents(buttons)

            resolve(messageActionRow);
        } catch (e) {
            reject(e)
        }
    })
}