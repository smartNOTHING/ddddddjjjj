const { getLyrics } = require('genius-lyrics-api');
const getSong = require('genius-lyrics-api/lib/getSong');

module.exports = {
    name: 'lyrics',
    description: 'lyrics',
    usage: '',
    args: true,
    async execute(args, message) {
        const ARTIST = args[0];
        const TITLE = args.slice(1).join(' ');
        const options = {
            apiKey: 'NuJ5nkRz17pGQRKTKWql9Vj4oFOfoD3HWmp1dL5WJD-UY5qqy3HwPPOuFKunvEGr',
            title: TITLE,
            artist: ARTIST,
            optimizeQuery: true,
        };

        getLyrics(options).then((lyrics) => message.channel.send(lyrics));

        getSong(options).then((song) =>
            console.log(`
            ${song.id}
            ${song.url}
            ${song.albumArt}
            ${song.lyrics}
            `),
        );
    },
};