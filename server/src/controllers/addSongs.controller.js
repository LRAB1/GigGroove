const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyAccount, spotifyRedirectUri } = require('../../../keys');
const { artist, song } = require('../../data/setlist');
const express = require('express');
const app = express();

// Create a new instance of the Spotify Web API client
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClient,
  clientSecret: spotifySecret,
  redirectUri: spotifyRedirectUri
});

// Authorization callback route
app.get('/callback', (req, res) => {
  const { code } = req.query;

  // Exchange the authorization code for an access token
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const accessToken = data.body['access_token'];
      const refreshToken = data.body['refresh_token'];

      // Set the access token and refresh token on the API client
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      // Continue with adding songs to the playlist
      return addSongsToPlaylist();
    })
    .then(() => {
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

// Route to initiate the authorization flow
app.get('/', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(['playlist-modify-private'], 'state');
  res.redirect(authorizeURL);
});

// Function to add tracks to the playlist
const addSongsToPlaylist = () => {
  // Placeholder implementation
  console.log('Adding songs to the playlist...');
  return Promise.resolve();
};


//Incase this code needs to be running it's own server instance
/*// Start the server
const port = 8888;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});*/
