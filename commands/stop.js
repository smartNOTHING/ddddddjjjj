module.exports = {
    name: 'stop',
    description: 'stop',
    aliases: ['st'],
    usage: '',
    async execute(args, message) {
        const player = message.client.manager.get(message.guild.id);
        const { channel } = message.member.voice;

        if (!channel) return message.repy('You need to be in a voice channel.');
        if (channel.id !== player.voiceChannel) return message.reply('Youre not in the same voice channel');

        player.destroy();
        return message.reply('Stopped the player!');
        },
    };