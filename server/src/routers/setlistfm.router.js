const express = require('express');
const app = express();
const setlistfmController = require('./path-to/setlistfm.controller'); // Import your controller

app.post('/api/setlistfm', async (req, res) => {
  try {
    const setlistId = req.body.setlistId;
    const setlistData = await setlistfmController.searchSetlist(setlistId);
    res.json(setlistData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching Setlist.fm data' });
  }
});

// Your other server setup code

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
