// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const port = process.env.PORT || 3030;
const setlistfmController = require('./src/controllers/setlistfm.controller');
const createServer = require('./src/controllers/spotify.controller');  // Import the factory function

const cleanUpRouter = require('./src/routers/cleanup.router');

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

// Use the cleanUpRouter for the "cleanup" route
app.use('/api', cleanUpRouter);

// Call the factory function to get the groovify function and server
const { groovify, server } = createServer();

// Call groovify from the server
groovify();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
