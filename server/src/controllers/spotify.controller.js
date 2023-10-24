const http = require('http');
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyAccount, spotifyRedirectUri } = require('../../../keys');
const { artist, venue, tour, songs } = require('../../data/setlist');

const port = 3002;

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

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/') {
      const authorizeURL = spotifyApi.createAuthorizeURL(['playlist-modify-private'], 'state');
      res.writeHead(302, { 'Location': authorizeURL });
      res.end();
    } else if (req.url.startsWith('/callback')) {
      const urlParams = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
      const code = urlParams.get('code');

      // Exchange the authorization code for an access token
      const data = await spotifyApi.authorizationCodeGrant(code);
      console.log('Access token generated');

      // Set the access token and refresh token on the API client
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);

      const playlistId = await createPlaylist();
      console.log('Playlist ID:', playlistId);
      await addSongsToPlaylist(playlistId);

      console.log('All tracks added to the playlist successfully!');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`
        <h1>Authorization Successful!</h1>
        <p>Playlist created and songs added!</p>
      `);
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('Not Found');
      res.end();
    }
  } catch (error) {
    console.log('Error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('Internal Server Error');
    res.end();
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});