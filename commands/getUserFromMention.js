module.exports = function getUserFromMention(mention) {
    const { client } = require('../bot');
    const matches = mention.match(/^<@!?(\d+)>$/);

    if (!matches) return;
    const id = matches[1];
    return client.users.cache.get(id);
};