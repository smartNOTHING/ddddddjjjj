module.exports = {
    name: 'list',
    description: 'list',
    usage: '',
    execute(args, message) {
        const list = message.client.commands;
        list.forEach(c => console.log(`${c.name} - ${c.usage || c.description}`));
    },
};