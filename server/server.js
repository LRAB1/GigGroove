const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const setlistfmController = require('./src/controllers/setlistfm.controller');
const spotifyRouter = require('./src/routers/spotify.router');
const cleanupRouter = require('./src/routers/cleanup.router');
const spotifyAuthRouter = require('./src/controllers/spotify.auth.controller');

app.use(express.json());
app.use(cors());

// Your existing searchSetlist route
app.post('/api/searchSetlist', async (req, res) => {
  const setlistId = req.body.setlistId;

  try {
    const setlistData = await setlistfmController.searchSetlist(setlistId);

    res.json(setlistData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching Setlist.fm data' });
  }
});

// Use the cleanupRouter for the "cleanup" route
app.use('/api', cleanupRouter);

// Use the spotifyAuthRouter for the Spotify authentication flow
app.use('/spotify', spotifyAuthRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
