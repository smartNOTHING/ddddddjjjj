module.exports = {
    name: 'queue',
    description: 'queue',
    usage: '',
    aliases: ['q'],
    async execute(args, message) {
        const { client } = require('../bot');
        let queue = client.distube.getQueue(message);
        if (!queue) return message.channel.send('There is nothing playing!');
        let q = queue.songs.map((song, i) => {
            return `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``;
        }).join('\n');
        message.channel.send(`**Server Queue**\n${q}`);
    },
};