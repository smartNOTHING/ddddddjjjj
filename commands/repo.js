const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'repo',
    description: 'The GitHub repository for this bot',
    usage: '',
    execute(args, message) {
        const { client } = require('../bot');
        const embed = new MessageEmbed()
            .setAuthor(client.user.tag, client.user.displayAvatarURL())
            .setColor(0xff0000)
            .setTitle('GitHub Repositories')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription('These are the repositories for the JavaScript source code of this bot. The Master repo is always stable code, and the Nightly repo is where i push ALL update, which some might be buggy.')
            .addFields(
                { name: '\u200B', value: '\u200b' },
                { name: '\u200b', value: '\u200B', inline: true },
                { name: 'Master Repository', value: 'https://github.com/SynysterZV/discord-bot', inline: true },

                { name: 'Nightly Repository', value: 'https://github.com/SynysterZV/discord-bot/tree/Nightly', inline: true },
                { name: '\u200b', value: '\u200B' },
            )
            .setFooter('SynBot')
            .setTimestamp();
        message.channel.send(embed);

    },
};