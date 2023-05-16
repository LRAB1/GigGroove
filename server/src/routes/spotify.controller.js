// Import required libraries
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyAccount } = require('../../keys.js');
const artist = require('../../data/setlist.js')

// Set the input setlist
const setlistSpotify = {
  artist: 
  venue: "AFAS Live",
  tour: "Europe 2022",
  songs: ["Failure", "Kingdom", "By Your Command", "Aftermath", "Regulator", "Deadhead", "Deep Peace", "March of the Poozers", "More!"]
};

// Create a new instance of the Spotify Web API client
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyClient,
  clientSecret: spotifySecret,
  redirectUri: 'http://localhost:8888/callback'
});

// Retrieve an access token using the Client Credentials flow
spotifyApi.clientCredentialsGrant().then((data) => {
  console.log('Access token generated');

  // Set the access token on the API client
  spotifyApi.setAccessToken(data.body['access_token']);

  // Create a new playlist with the given name
  spotifyApi.createPlaylist(spotifyAccount, { name: `${setlist.artist} Live at ${setlist.venue}` })
    .then((data) => {
      console.log(`Playlist created: ${data.body.name}`);

      // Add each song to the playlist
      setlist.songs.forEach((song) => {
        // Search for the track using the artist and song name
        spotifyApi.searchTracks(`${setlist.artist} ${song}`)
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
