const { MessageEmbed } = require('discord.js');
const pms = require('pretty-ms');

module.exports = {
    name: 'queue',
    description: 'queue',
    aliases: ['q'],
    usage: '',
    execute(args, message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('there is no player for this guild.');

        const queue = player.queue;
        const embed = new MessageEmbed()
          .setAuthor(`Queue for ${message.guild.name}`)
          .setColor(0xff0000);

        // change for the amount of tracks per page
        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

        const end = page * multiple;
        const start = end - multiple;

        const tracks = queue.slice(start, end);
        const remain = queue.current.duration - player.position;
        if (queue.current) embed.addField('Current', `[${queue.current.title}](${queue.current.uri}) - Time Remaining: ${pms(remain)}`);

        if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : 'the queue'}.`);
        else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri}) - ${pms(track.duration, { compact: true })}`).join('\n'));


        const maxPages = queue.length ? Math.ceil(queue.length / multiple) : 1;

        embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

        return message.reply(embed);
    },
};