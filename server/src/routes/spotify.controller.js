const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyAccount } = require('../../../keys');
const { artist, venue, tour, songs } = require('../../data/setlist.js');

// Set the input setlist
const setlistSpotify = {
  artist: artist,
  venue: venue,
  tour: tour,
  songs: songs
};

// Create a new instance of the Spotify Web API client
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClient,
  clientSecret: spotifySecret,
  redirectUri: 'http://localhost:8888/callback'
});

// Define the desired scopes
const scopes = ['playlist-modify-public', 'playlist-modify-private'];

// Generate the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

// Log the authorization URL and prompt the user to visit it to grant access
console.log(`Please authorize the application by visiting this URL: ${authorizeURL}`);

// After the user grants access and is redirected to the callback URL
// Exchange the authorization code for an access token
const authorizationCode = '...'; // Replace with the received authorization code
spotifyApi.authorizationCodeGrant(authorizationCode).then((data) => {
  console.log('Access token generated');

  // Set the access token and refresh token on the API client
  spotifyApi.setAccessToken(data.body['access_token']);
  spotifyApi.setRefreshToken(data.body['refresh_token']);

  // Create a new playlist with the given name
  spotifyApi.createPlaylist(spotifyAccount, { name: `${setlistSpotify.artist} Live at ${setlistSpotify.venue}`, public: false })
    .then((data) => {
      console.log(`Playlist created: ${data.body.name}`);

      // Add each song to the playlist
      setlistSpotify.songs.forEach((song) => {
        // Search for the track using the artist and song name
        spotifyApi.searchTracks(`${setlistSpotify.artist} ${song}`)
          .then((data) => {
            // Add the first track from the search results to the playlist
            if (data.body.tracks.items.length > 0) {
              const track = data.body.tracks.items[0];
              spotifyApi.addTracksToPlaylist(spotifyAccount, data.body.id, [`spotify:track:${track.id}`])
                .then(() => {
                  console.log(`Added ${track.name} by ${track.artists[0].name} to playlist`);
                });
            }
          });
      });
    });
}).catch((err) => {
  console.log('Access token error:', err);
});