const { MessageEmbed } = require('discord.js');

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
        const rem = `${new Date(player.position).toISOString().slice(14, 19)} / ${new Date(queue.current.duration).toISOString().slice(14, 19)}`;
        console.log(rem);
        if (queue.current) embed.addField('Current', `[${queue.current.title}](${queue.current.uri}) - ${rem}`);

        if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : 'the queue'}.`);
        else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri}) - ${new Date(track.duration).toISOString().slice(14, 19)}`).join('\n'));


        const maxPages = queue.length ? Math.ceil(queue.length / multiple) : 1;

        embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

        return message.reply(embed);
    },
};