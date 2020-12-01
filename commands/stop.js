module.exports = {
    name: 'stop',
    description: 'Stop music on YTDL',
    aliases: ['st'],
    async execute(args, message) {
        const { serverQueue } = require('./play');
        if (!message.member.voice.channel) {
          return message.channel.send(
            'You have to be in a voice channel to stop the music!',
          );
        }
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
      },
};