module.exports = {
    name: 'gufm',
    description: 'gufm',
    usage: '',
    getUserFromMention(mention) {
    const { client } = require('../bot');
    const matches = mention.match(/^<@!?(\d+)>$/);

    if (!matches) return;
    const id = matches[1];
    return client.users.cache.get(id);
},
};