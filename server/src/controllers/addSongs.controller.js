const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyAccount, spotifyRedirectUri } = require('../../../keys');

// Create a new instance of the Spotify Web API client
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClient,
  clientSecret: spotifySecret,
  redirectUri: spotifyRedirectUri
});

// Function to add tracks to the playlist
const addSongsToPlaylist = (songs, playlistId) => {
  const addTracksPromises = [];

  songs.forEach((song) => {
    addTracksPromises.push(
      spotifyApi.searchTracks(`${artist} ${song}`).then((data) => {
        if (data.body.tracks.items.length > 0) {
          const track = data.body.tracks.items[0];
          return spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${track.id}`])
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
};

module.exports = { addSongsToPlaylist };
