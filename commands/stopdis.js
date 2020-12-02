const { execute } = require("./playdis");

module.exports = {
    name: 'stop',
    description: 'stop',
    usage: '',
    aliases: ['st'],
    async execute(args, message) {
        const { client } = require('../bot');
        if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel!');
        if (!client.distube.isPlaying(message)) return message.channel.send('There is nothing playing!');
        client.distube.stop(message);
        message.channel.send('Stopped!');
    },
};