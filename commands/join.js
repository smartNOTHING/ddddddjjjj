module.exports = {
    name: 'join',
    description: 'join',
    usage: '',
    execute(args, message) {
        const { client } = require('../bot');
        client.emit('guildMemberAdd', message.member);
    },
};