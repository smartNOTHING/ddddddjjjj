const fs = require('fs');
const got = require('got');
const jdsom = require('jsdom');
const { JSDOM } = jdsom;

module.exports = {
    name: 'test',
    description: 'test',
    usage: '',
    execute(args, message) {
        const url = 'http://scp-wiki.wikidot.com/scp-3894';

        got(url).then(response => {
            const dom = new JSDOM(response.body);
            const text = dom.window.document.getElementById('');
            console.log(text);
        }).catch(err => console.log(err));
    },
};