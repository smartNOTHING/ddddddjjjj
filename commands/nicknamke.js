module.exports = {
    name: 'nickname',
    description: 'nickname',
    args: true,
    usage: '{nickname}',
    aliases: ['nick'],
    execute(args, message) {
        const member = message.mentions.users.first() ? message.guild.member(message.mentions.users.first()) : message.member;
        let nick = message.mentions.users.first() ? args.slice(1).join() : args.join(' ');

        if(message.mentions.users.first()) {
            if(!message.member.hasPermission('MANAGE_NICKNAMES')) return message.reply('You cannot change other members nicknames!');
        }
        if (message.guild.ownerID == member.id) return message.reply('I cannot change the owners nickname');
        if (nick == 'remove') nick = member.user.username;
        member.setNickname(nick).catch(e => (message.reply(e)));
    },
};