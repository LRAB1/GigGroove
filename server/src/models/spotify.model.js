//TODO build integration with spotify API.
const SpotifyWebApi = require('spotify-web-api-node');
const {spotifyClient, spotifySecret} = require('../../../keys');
//TODO: create artist as variable.
const artist = "6uejjWIOshliv2Ho0OJAQN?si=wcoeBJVIQeWqZLPChpFDmQ";


function connectToSpotifyApi(spotifyClient, spotifySecret) {
  // create a new instance of the SpotifyWebApi object
  const spotifyApi = new SpotifyWebApi({
    clientId: spotifyClient,
    clientSecret: spotifySecret
  });

  // retrieve an access token using the client ID and client secret
  spotifyApi.clientCredentialsGrant().then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Connected to Spotify API') ;
  }).catch((error) => {
    console.log('Error connecting to Spotify API:', error);
  });

  return spotifyApi;
}

const getArtist = connectToSpotifyApi(spotifyClient, spotifySecret);

/*
const getArtist = spotifyApi.Artist(artist)
  .then(data => {
    console.log('Retrieved artist', data.body);
  })
  .catch(error => {
    console.log('Error retrieving artist', error);
  });*/
