// cleanup.router.js
const express = require('express');
const router = express.Router();
const setlistModel = require('../models/setlist.model');
const { formatSetlist} = require('../models/setlist.model');

router.post('/cleanup', async (req, res) => {
  console.log('Cleanup request fired off');

  try {
    // Assuming you have some data to format, you can pass it to the formatSetlist function
    const formattedData = setlistModel.formatSetlist(req.body);

    // You can send back the formatted data as a response or perform other operations
    // Respond with the formatted data
    res.json(formattedData);
    console.log(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during setlist cleanup' });
  }
});

module.exports = router;
