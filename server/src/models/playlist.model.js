//Creates playlist.json

const fs = require('fs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret } = require('../../../keys');
const setlist = require('../../data/setlist');

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

function searchTracks(spotifyApi, artistName, setlist) {
  const trackIds = [];
  const promises = [];

  const artistId = searchArtist(spotifyApi, artistName);

  setlist.forEach((set, setIndex) => {
    set.songs.forEach((song) => {
      const searchResult = spotifyApi.searchTracks(`track:${song} artist:${artistName}`);
      const promise = searchResult.then((data) => {
        if (data.body.tracks.total > 0) {
          const topTrack = data.body.tracks.items[0];
          console.log(`Found track: ${topTrack.name} by ${topTrack.artists[0].name}`);
          trackIds.push(topTrack.id);
        } else {
          console.log(`Track not found: ${song}`);
        }
      }).catch((error) => {
        console.log(`Error searching for track: ${song}`, error);
        throw error;
      });
      promises.push(promise);
    });
  });

  Promise.all(promises).then(() => {
    if (trackIds.length === setlist.reduce((total, set) => total + set.songs.length, 0)) {
      const output = {
        artist: artistName,
        songs: trackIds,
      };
      const outputPath = path.join(__dirname, '../../data/playlist.js');
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
      console.log(`Playlist saved to ${outputPath}`);
    }
  }).catch((error) => {
    console.log('Error:', error);
  });
}

connectToSpotifyApi(spotifyClient, spotifySecret)
  .then((spotifyApi) => searchTracks(spotifyApi, setlist.artist, setlist.songs))
  .catch((error) => {
    console.log('Error:', error);
  });
