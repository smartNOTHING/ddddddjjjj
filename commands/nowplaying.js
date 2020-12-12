const { MessageEmbed } = require('discord.js');
const createBar = require('string-progressbar');

module.exports = {
    name: 'nowplaying',
    description: 'nowplaying',
    usage: '',
    aliases: ['np'],
    execute(args, message) {
        const player = message.client.manager.get(message.guild.id);
        if(!player) return message.reply('There is no player for this guild');

        const { title, requester, thumbnail, uri, duration } = player.queue.current;

        const bar = new Date(player.position).toISOString().slice(14, 19) + ' [' + createBar(duration == 0 ? player.position : duration, player.position, 15)[0] + '] ' + new Date(duration).toISOString().slice(14, 19);
        const guild = message.guild;
        const embed = new MessageEmbed()
        .setAuthor(requester.tag, requester.displayAvatarURL())
        .setFooter(guild, guild.iconURL())
        .setTimestamp()
        .setTitle('» Now Playing:')
        .setThumbnail(thumbnail)
        .setDescription(`\n[${title}](${uri})`)
        .setColor(0xff0000)
        .addField('\u200b', bar, false);

        message.channel.send(embed).then(m => m.delete({ timeout: 30000 }));
        message.delete();
    },
};