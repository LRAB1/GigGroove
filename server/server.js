const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const setlistfmController = require('./src/controllers/setlistfm.controller');
const formatSetlist = require('./src/models/setlist.model');
const setlistFmRouter = require('./src/routers/setlistfm.router'); 

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

// Use the setlistFmRouter for the "groovify" route
app.use('/api/groovify', setlistFmRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
