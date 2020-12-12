module.exports = {
    name: 'nigga',
    description: 'nigga',
    usage: '',
    async execute(args, message) {
        const { channel } = message.member.voice;

        if (!channel) return message.reply('you need to join a voice channel.');

        const player = message.client.manager.create({
          guild: message.guild.id,
          voiceChannel: channel.id,
          textChannel: message.channel.id,
        });

        if (player.state !== 'CONNECTED') player.connect();

        const search = 'https://youtu.be/Q-tH0olciZU?t=5';
        let res;

        try {
          res = await player.search(search, message.author);
          if (res.loadType === 'LOAD_FAILED') {
            if (!player.queue.current) player.destroy();
            throw res.exception;
          }
        }
        catch (err) {
          return message.reply(`there was an error while searching: ${err.message}`);
        }

           return player.play(res.tracks[0], { startTime: 5500, endTime: 19000 });
    },
};