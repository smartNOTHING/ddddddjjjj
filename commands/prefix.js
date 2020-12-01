module.exports = {
    name: 'prefix',
    description: 'prefix',
    async execute(args, message, globalPrefix){
        const { prefixes } = require('../bot')
        if (args.length) {
            await prefixes.set(message.guild.id, args[0]);
            return message.channel.send(`Successfully set prefix to \`${args[0]}\``)
        }

        return message.channel.send(`Prefix is \`${await prefixes.get(message.guild.id) || globalPrefix}\``)
    }
}