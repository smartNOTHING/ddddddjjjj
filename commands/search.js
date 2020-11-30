module.exports = {
    name: 'search',
    description: 'search',
    execute(message, args) {
        var SpotifyWebApi = require('spotify-web-api-node')

var clientId= '59bd11b43b17467dabb20de917c717f2',
    clientSecret = 'bc28866ed8254af994743f18d88eaf15';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    accessToken: ''
});

spotifyApi.clientCredentialsGrant().then(
    function(data) {
        console.log('The access token is ' + data.body['access_token']);
        spotifyApi.setAccessToken(data.body['access_token']);
        const ac = data.body['access_token']

        spotifyApi.searchTracks(`track:${args}`).then(
            function(data) {
                for (key in data.body.tracks.items){
                    console.log(data.body.tracks.items[key])
                }
            },
            function(err){
                console.log('Something went wrong!', err);
            }
        );
        
        },
    function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);


},
}