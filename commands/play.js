const ytdl = require('ytdl-core');
const yts = require('yt-search');
const queue = new Map();

module.exports = {
    name: 'play',
    description: 'Play Music from YTDL',
    aliases: ['p'],
    async execute(args, message) {
        const voiceChannel = message.member.voice.channel;
        const serverQueue = queue.get(message.guild.id);

        if (!voiceChannel) {
            return message.channel.send(
                'You need to be in a voice channel to play music!',
            );
            }
        if (ytdl.validateURL(args[0])) {
        const songInfo = await ytdl.getInfo(args[0]);
        song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };
    }
    else {
        const { videos } = await yts(args.slice(0).join(' '));
        if (!videos.length) return message.channel.send('No songs were found!');
        song = {
            title: videos[0].title,
            url: videos[0].url,
            time: videos[0].duration.timestamp,
        };
    }

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

        queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            const connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }

        function play(guild, song) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
              serverQueue.voiceChannel.leave();
              queue.delete(guild.id);
              return;
            }
            const dispatcher = serverQueue.connection
              .play(ytdl(song.url))
              .on('finish', () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
              })
              .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Now playing: **${song.title}**`);
            module.exports = { serverQueue };
          }
        },

};