const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyAccount, spotifyRedirectUri } = require('../../../keys');
const { artist, venue, tour, songs } = require('../../data/setlist.js');
const setlist = require('../../data/setlist.js');

const app = express();

let accessToken = '';
let refreshToken = '';
let playlistId = '';

// Create a new instance of the Spotify Web API client
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClient,
  clientSecret: spotifySecret,
  redirectUri: spotifyRedirectUri
});

// Define the desired scopes
const scopes = ['playlist-modify-public', 'playlist-modify-private'];

// Generate the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

// Route to initiate the authorization flow
app.get('/authorize', (req, res) => {
  res.redirect(authorizeURL);
});

// Route for the Spotify callback
app.get('/callback', (req, res) => {
  const { code } = req.query;

  // Exchange the authorization code for an access token
  spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
      console.log('Access token generated');

      // Set the access token and refresh token
      accessToken = data.body['access_token'];
      refreshToken = data.body['refresh_token'];
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      const playlistName = `${setlist.artist} ${setlist.tour} Live at ${setlist.venue}`;

      // Get the current user's data
      return spotifyApi.getMe().then((userData) => {
        const username = userData.body.id;

        // Create a new playlist with the given name
        return spotifyApi.createPlaylist(username, { name: playlistName, public: false }).then((data) => {
          console.log(`Playlist created: ${data.body.name}`);
          playlistId = data.body.id;
          return addTracksToPlaylist(username, songs);
        });
      });
    })
    .then(() => {
      console.log('All tracks added to the playlist successfully!');
      res.send(`Authorization successful! Playlist ID: ${playlistId}`);
    })
    .catch((err) => {
      console.log('Access token error:', err);
      // Redirect to an error page or perform any other necessary actions
      res.send('Authorization failed!');
    });
});

// Function to add tracks to the playlist
const addTracksToPlaylist = (username, songs) => {
  return spotifyApi.getPlaylist(username, playlistId)
    .then((data) => {
      const playlist = data.body;
      const addTracksPromises = [];

      songs.forEach((song) => {
        addTracksPromises.push(
          spotifyApi.searchTracks(`${setlist.artist} ${song}`).then((data) => {
            if (data.body.tracks.items.length > 0) {
              const track = data.body.tracks.items[0];
              return spotifyApi.addTracksToPlaylist(username, playlistId, [`spotify:track:${track.id}`])
                .then(() => {
                  console.log(`Added ${track.name} by ${track.artists[0].name} to playlist`);
                })
                .catch((error) => {
                  console.log(`Error adding track to the playlist: ${error.message}`);
                });
            } else {
              console.log(`No track found for ${song}`);
            }
          })
        );
      });

      return Promise.all(addTracksPromises);
    });
};

// Start the server
app.listen(8888, () => {
  console.log('Server is running on port 8888');
});
