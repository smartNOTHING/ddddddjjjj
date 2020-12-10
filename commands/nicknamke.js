module.exports = {
    name: 'nickname',
    description: 'nickname',
    args: true,
    usage: '{nickname}',
    aliases: ['nick'],
    execute(args, message) {
        let member;
        let nick;


        if(message.mentions.users.first()) {
            if(!message.member.hasPermission('MANAGE_NICKNAMES')) return message.reply('You dont have the right permissions!');
            member = message.guild.member(message.mentions.users.first());
            if (member.guild.ownerID == member.id) return message.reply('I cannot change the guild owners nickname!');
            if(args.slice(1).join(' ') == 'remove') {
                nick = member.user.username;
            }
            else {
            nick = args.slice(1).join(' ');
            }
        }
        else {
            if(message.guild.ownerID == message.author.id) return message.reply('I cannot change the guild owners nickname!');
            member = message.member;
            nick = args.join();
        }

        member.setNickname(nick).catch(e => (message.reply(e)));
    },
};