module.exports = {
    name: 'skip',
    description: 'skip',
    usage: '',
    aliases: ['s'],
    async execute(args, message) {
        const { client } = require('../bot');
        if (!message.member.voice.channel) return message.channel.send('You must be in a vocie channel to skip music');
        if (!client.distube.isPlaying(message)) return message.channel.send('There is no music playing');
        const queue = await client.distube.skip(message);
        message.channel.send(`Skipped: ${queue.songs[0].name}`);
    },
};