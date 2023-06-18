const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyAccount, spotifyRedirectUri } = require('../../../keys');
const { artist, venue, tour, songs } = require('../../data/setlist');

const app = express();
const port = 8888;

// Create a new instance of the Spotify Web API client
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClient,
  clientSecret: spotifySecret,
  redirectUri: spotifyRedirectUri
});

// Function to create a playlist
const createPlaylist = async () => {
  try {
    const playlistName = `${artist} - ${tour}`;

    const createPlaylistResponse = await spotifyApi.createPlaylist(artist, { name: playlistName, public: false });
    console.log('Playlist created');
    return createPlaylistResponse.body.id;
  } catch (error) {
    console.log('Error creating playlist:', error);
    throw error;
  }
};

// Function to add tracks to the playlist
const addSongsToPlaylist = async (playlistId) => {
  try {
    const { songs } = require('../../data/setlist');

    for (const set of songs) {
      for (const song of set.songs) {
        const searchResult = await spotifyApi.searchTracks(`${artist} ${song}`);
        if (searchResult.body.tracks.items.length > 0) {
          const track = searchResult.body.tracks.items[0];
          await spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${track.id}`]);
          console.log(`Added ${track.name} by ${track.artists[0].name} to playlist`);
        } else {
          console.log(`No track found for ${song}`);
        }
      }
    }

    console.log('All tracks added to the playlist successfully!');
  } catch (error) {
    console.log('Error adding tracks to the playlist:', error);
  }
};

// Route to initiate the authorization flow
app.get('/', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(['playlist-modify-private'], 'state');
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
      return addSongsToPlaylist(playlistId);
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
