const ytdl = require('ytdl-core');
const yts = require('yt-search');
const queue = new Map();
const COOKIE = 'VISITOR_INFO1_LIVE=ibYZIbttavQ; CONSENT=YES+US.en+20170219-14-0; LOGIN_INFO=AFmmF2swRQIhALyyaqI3SA7mhMwaLrIodSKyiPYiYej2Prj5D49W-8o8AiAx1lBd33p8FuG0atAAZLbW1cvlUOYftWc0dHUyjhExsQ:QUQ3MjNmeDk2U2dfdmdIN0g0N0lTaVlJZ0JDeEIxcGZKbnYxNTkzRkZXM3JfSk54dWNDTm4yU2lVQ0d5eGR2c1ZlTkVTTVdXYlNrdld6Wk9ySnEtckwybWg3ekpRMXVwaTEyRVo0TmpUUWhxZFFxZTIyVHkxS05fQXJSVU1Cd3VWUmptSVktMjU4bnJGMmMtSllDbHpjQjYzMTNpLTNmcTZ3ejZjMWdjX1o4Sm1yUlpDR1FHYkZz; PREF=al=en&f6=400; YSC=KRJCzPt3kw4; HSID=A3-mNC7yFmVlTQFTG; SSID=ABeHRQHYblesKapip; APISID=wQkZxtcDbJrsbzo4/AzSyJQ4tX4KnAZu63; SAPISID=AG2dFo1oLNQmg920/A1_37p9-w2kakS987; __Secure-3PAPISID=AG2dFo1oLNQmg920/A1_37p9-w2kakS987; SID=4AfhdoLl32_Mrjh2QqnHPcr1HvQ6IHYJs2xTNy1hE98-QJ0O-6vVxCl7tIJj-JF-TPH6fg.; __Secure-3PSID=4AfhdoLl32_Mrjh2QqnHPcr1HvQ6IHYJs2xTNy1hE98-QJ0O4RGyMeetwkT8cvE45pWn8w.; SIDCC=AJi4QfHlj15-8GfvLri3pUN0mpXt-HgN8R6hu8TaZ09hht0kvNjoR8QQpdU4_SZrKuFHUjxe3g; __Secure-3PSIDCC=AJi4QfHX3c4JR32WNpPr1b8Tz7-MbrpW3PAX3VLpDc4td47Iv4vmctZyQYZ9H9KBXRKDobQZOg'  


module.exports = {
    name: 'playex',
    description: 'Play Music from YTDL',
    usage: '{YT Video Link | Search name}',
    async execute(args, message) {
        const voiceChannel = message.member.voice.channel;
        const serverQueue = queue.get(message.guild.id);

        if (!voiceChannel) {
            return message.channel.send(
                'You need to be in a voice channel to play music!',
            );
            }
        if (ytdl.validateURL(args[0])) {
        const songInfo = await ytdl.getBasicInfo(args[0]);
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
            .play(ytdl(song.url, {
                  requestOptions: {
                      headers: {
                          cookie: COOKIE,
                      },
                  },
              }))
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