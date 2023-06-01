const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyAccount, spotifyRedirectUri } = require('../../../keys');
const { artist, venue, tour, songs } = require('../../data/setlist');
const { addSongsToPlaylist } = require('./addSongs.controller.js');

const app = express();
const port = 8888;

// Create a new instance of the Spotify Web API client
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClient,
  clientSecret: spotifySecret,
  redirectUri: spotifyRedirectUri
});

// Function to create a playlist
const createPlaylist = () => {
  return spotifyApi.createPlaylist(artist, { public: false })
    .then((data) => {
      console.log('Playlist created');
      return data.body.id;
    })
    .catch((error) => {
      console.log('Error creating playlist:', error);
      throw error;
    });
};

// Route to initiate the authorization flow
app.get('/', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(['playlist-modify-public'], 'state');
  res.redirect(authorizeURL);
});

// Route for the Spotify callback
app.get('/callback', (req, res) => {
  const { code } = req.query;

  // Exchange the authorization code for an access token
  spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
      console.log('Access token generated');

      // Set the access token and refresh token on the API client
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);

      return createPlaylist();
    })
    .then((playlistId) => {
      console.log('Playlist ID:', playlistId);
      return addSongsToPlaylist(songs, playlistId);
    })
    .then(() => {
      console.log('All tracks added to the playlist successfully!');
      res.send(`
        <h1>Authorization Successful!</h1>
        <p>Playlist created and songs added!</p>
      `);
    })
    .catch((err) => {
      console.log('Access token error:', err);
      // Redirect to an error page or perform any other necessary actions
      res.send('Authorization failed!');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
