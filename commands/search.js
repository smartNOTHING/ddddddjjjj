const SpotifyWebApi = require('spotify-web-api-node');
const play = require('./play');

module.exports = {
    name: 'search',
    description: 'search',
    execute(args, message) {

const clientId = '59bd11b43b17467dabb20de917c717f2',
    clientSecret = 'bc28866ed8254af994743f18d88eaf15';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    accessToken: '',
});

spotifyApi.clientCredentialsGrant().then(
    function(data) {
        console.log('The access token is ' + data.body['access_token']);
        spotifyApi.setAccessToken(data.body['access_token']);
        const search = args.join().slice(31, 53);
        console.log(search);

        spotifyApi.getTrack(search).then(
            function(data) {
                const args = data.body.name.split(/\s+/);
                play.execute(args, message);
            },
            function(err) {
                console.log('Something went wrong!', err);
            },
        );
        },
    function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    },
);


},
};