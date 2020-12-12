const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'fastforward',
    description: 'fastforward',
    usage: '{seconds}',
    aliases: ['ff'],
    execute(args, message) {


        function hmsToSecondsOnly(str) {
            const p = str.split(':');
            let s = 0, m = 1;

            while(p.length > 0) {
                s = +m * parseInt(p.pop(), 10);
                m = m * 60;
            }
            return s;
        }

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.channel.send('There is no player for this guild!');

        const { channel } = message.member.voice;
        if(!channel) return message.reply('You need to be in a voice channel');

        const time = hmsToSecondsOnly(args[0]) * 1000;
        if (time + player.position >= player.queue.current.duration) {
            message.channel.send(`The song is only ${new Date(player.queue.current.duration).toISOString.slice(14, 19)}.`);
        }
        else {
            player.seek(player.position + time);
            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .setDescription(`Time Skipped ahead to ${new Date(player.position).toISOString().slice(14, 19)}.`);
            message.channel.send(embed);
        }
    },
};