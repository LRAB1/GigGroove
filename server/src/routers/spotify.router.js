const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotify.controller');

router.post('/groovify', async (req, res) => {
  try {
    const playlistId = await spotifyController.createPlaylist();
    console.log('Playlist ID:', playlistId);
    await spotifyController.addSongsToPlaylist(playlistId);

    console.log('All tracks added to the playlist successfully!');
    res.status(200).json({ message: 'Spotify integration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Spotify integration failed. An error occurred.' });
  }
});

module.exports = spotifyRouter;
