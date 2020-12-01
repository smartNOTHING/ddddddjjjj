const Discord = require('discord.js')

module.exports = {
    name: 'queue',
    description: 'queue',
    aliases: ['q'],
    usage: '',
    async execute(args, message) {
            const { serverQueue } = require('./play');
            const embed = new Discord.MessageEmbed()
            .setTitle('Queue')
            .setColor(0xff0000);
            for(const key in serverQueue.songs) {
              embed.addField(serverQueue.songs[key]['title'], serverQueue.songs[key]['url']);
              embed.addField(serverQueue.songs[key]['time'], '--------------------------------------------------------');
            }
            message.channel.send(embed);
    },
};