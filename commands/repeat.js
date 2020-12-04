module.exports = {
    name: 'repeat',
    descriptions: 'repeat',
    aliases: ['r'],
    usage: '',
    execute(args, message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('There is no player for this guild');

        const { channel } = message.member.voice;

        if (!channel) return message.reply('You need to join a voice channel');
        if (channel.id !== player.voiceChannel) return message.reply('Youre not in the same voice channel as the bot');

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? 'enabled' : 'disabled';
            return message.reply(`${queueRepeat} queue repeat.`);
        }

        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? 'enabled' : 'disabled';
        return message.reply(`${trackRepeat} track repeat.`);
    },
};