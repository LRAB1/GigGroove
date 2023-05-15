// Import the necessary modules
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret } = require('../../../keys');
const { artist, songs } = require('../../data/setlist');

// Create a new instance of the SpotifyWebApi object and connect to the API
function connectToSpotifyApi(spotifyClient, spotifySecret) {
  const spotifyApi = new SpotifyWebApi({
    clientId: spotifyClient,
    clientSecret: spotifySecret,
  });

  return spotifyApi.clientCredentialsGrant()
    .then((data) => {
      spotifyApi.setAccessToken(data.body.access_token);
      console.log('Connected to Spotify API');
      return spotifyApi;
    })
    .catch((error) => {
      console.log('Error connecting to Spotify API:', error);
      throw error;
    });
}

// Search for the artist ID using the artist name provided in setlist.js
function searchArtist(spotifyApi, artistName) {
  return spotifyApi.searchArtists(artistName)
    .then((data) => {
      if (data.body.artists.total > 0) {
        return data.body.artists.items[0].id;
      } else {
        console.log(`Artist not found: ${artistName}`);
        return null;
      }
    })
    .catch((error) => {
      console.log(`Error searching for artist: ${artistName}`, error);
      throw error;
    });
}

// Connect to the Spotify API and search for the artist ID
function getArtistId() {
  return connectToSpotifyApi(spotifyClient, spotifySecret)
    .then((spotifyApi) => searchArtist(spotifyApi, artist))
    .then((artistId) => {
      console.log(`Found artist ID: ${artistId}`); //Debug routine
      return artistId;
    });
}

getArtistId();

// Create a new instance of the SpotifyWebApi object and connect to the API
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClient,
  clientSecret: spotifySecret
});

// Get an access token using the built-in authorization tool
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    console.log('Connected to Spotify API');
    spotifyApi.setAccessToken(data.body['access_token']);

    // Use the access token to search for tracks on Spotify
    spotifyApi
      .searchTracks(songs.join(' '))
      .then((data) => {
        console.log(`Found ${data.body.tracks.total} tracks`);
        data.body.tracks.items.forEach((track) => {
          console.log(`Track name: ${track.name}, Artist: ${track.artists[0].name}`);
        });
      })
      .catch((error) => {
        console.log('Error searching for tracks:', error);
      });
  })
  .catch((error) => {
    console.log('Error connecting to Spotify API:', error);
  });
