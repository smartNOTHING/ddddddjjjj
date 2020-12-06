module.exports = {
    name: 'skip',
    description: 'skip',
    aliases: ['s'],
    usage: '',
    execute(args, message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('There is no player for this guild');

        const{ channel } = message.member.voice;
        if (!channel) return message.reply('You need to join a voice channel.');
        if (channel.id !== player.voiceChannel) return message.reply('Youre not in the same voice channel as the bot');

        if (!player.queue.current) return message.reply('There is no music playing');

        const { title } = player.queue.current;
        let song;

        if(!args.length) {
        player.stop();
        song = `${title} was skipped`;
        }
        else if (args.length == 1) {
            if (isNaN(args[0])) return message.reply('You must specify which track to skip');
            song = `${player.queue[args[0] - 1].title} was skipped`;
            player.queue.remove(args[0] - 1);
        }
        else if (args.length == 2) {
            console.log(args.length);
            if (isNaN(args[0]) || isNaN(args[1])) return message.reply('You must specify which tracks to skip');
            song = `${args[1] - args[0] + 1} Tracks Skipped`;
            player.queue.remove(args[0] - 1, args[1]);
        }
        return message.reply(`${song}`);
    },
};