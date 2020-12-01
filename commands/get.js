const { http } = require("winston");

module.exports = {
    name: 'gets',
    description: 'Gets Latest MC Server Version',
    execute(args, message, fs, fetch){
        fetch('https://launchermeta.mojang.com/mc/game/version_manifest.json')
        .then(res => res.json())
        .then(function(json) {
            var obj = json['latest']['release'];
            for(var key in json['versions']) {
                if (json['versions'][key]['id'] == obj) {
                    var url = json['versions'][key]['url']
                    fetch(url)
                    .then(res => res.json())
                    .then(function(json){
                        var server = json['downloads']['server']['url'];
                        message.channel.send(server);
                    });
                };
            };
            });
        }
     }
