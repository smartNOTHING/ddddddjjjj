module.exports = {
    name: 'play',
    description: 'play',
    usage: '{song}',
    aliases: ['p'],
    execute(args, message) {
        const { client } = require('../bot');
        try{
        client.distube.play(message, args.join(' '));
        }
        catch (error) {
            console.log(error);
        }
    },
};