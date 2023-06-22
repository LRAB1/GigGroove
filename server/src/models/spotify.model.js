//Converts setlist.js to a spotify playlist.

const fs = require('fs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret } = require('../../../keys');
//Commented out to test connection through playlist.json
//const { artist, songs } = require('../../data/setlist');
const {songs,artist} = require('../../data/playlist')

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

function searchTracks(spotifyApi, artistName, trackNames) {
  const trackIds = [];

  const artistId = searchArtist(spotifyApi, artistName);

  for (const trackName of trackNames) {
    const searchResult = spotifyApi.searchTracks(`track:${trackName} artist:${artistName}`);
    searchResult.then((data) => {
      if (data.body.tracks.total > 0) {
        const topTrack = data.body.tracks.items[0];
        console.log(`Found track: ${topTrack.name} by ${topTrack.artists[0].name}`);
        trackIds.push(topTrack.id);
      } else {
        console.log(`Track not found: ${trackName}`);
      }
      if (trackIds.length === trackNames.length) {
        const output = {
          artist,
          songs: trackIds,
        };
        const outputPath = path.join(__dirname, '../../data/playlist.json');
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        console.log(`Playlist saved to ${outputPath}`);
      }
    }).catch((error) => {
      console.log(`Error searching for track: ${trackName}`, error);
      throw error;
    });
  }
}

connectToSpotifyApi(spotifyClient, spotifySecret)
  .then((spotifyApi) => searchTracks(spotifyApi, artist, songs))
  .catch((error) => {
    console.log('Error:', error);
  });