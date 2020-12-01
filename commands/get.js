const fetch = require('node-fetch');

module.exports = {
    name: 'gets',
    description: 'Gets Latest MC Server Version',
    execute(args, message) {
        fetch('https://launchermeta.mojang.com/mc/game/version_manifest.json')
        .then(res => res.json())
        .then(function(json) {
            const obj = json['latest']['release'];
            for(const key in json['versions']) {
                if (json['versions'][key]['id'] == obj) {
                    const url = json['versions'][key]['url']
                    fetch(url)
                    .then(res => res.json())
                    .then(function(json) {
                        const server = json['downloads']['server']['url'];
                        message.channel.send(server);
                    });
                }
            }
            });
        },
     };
