module.exports = {
    name: 'pause',
    description: 'pause',
    usage: '',
    execute(args, message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('There is no player for this guild');

        const { channel } = message.member.voice;

        if (!channel) return message.reply('You need to be in a voice channel');
        if (channel.id !== player.voiceChannel) return message.reply('Youre not in the same voice channel as the bot');
        if (player.paused) return message.reply('The player is already pause');

        player.pause(true);
        return message.reply('Paused the player');
    },
};