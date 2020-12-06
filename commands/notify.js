module.exports = {
    name: 'notify',
    description: 'notify',
    usage: '',
    admin: true,
    execute(args, message) {
        if(!args.length) return message.reply('You need to specify a message');
        if(message.mentions.users.first()) return message.reply('You cannot mention a user in a notifcaiton');

        const server = message.guild.members.cache;
        const array = Array.from(server);
        for(const i in array) {
            const user = array[i][1].user;
            user.send(args.join(' ')).catch(() => message.reply(`Cant DM ${user}`));
        }
    },
};