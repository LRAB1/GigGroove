const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = process.env.PORT || 3001;
const setlistfmController = require('./src/controllers/setlistfm.controller'); // Import your controller

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.post('/api/searchSetlist', async (req, res) => {
  const setlistId = req.body.setlistId; // Get the Setlist ID from the request

  try {
    // Call the searchSetlist function from your controller
    const setlistData = await setlistfmController.searchSetlist(setlistId);

    res.json(setlistData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching Setlist.fm data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
