// cleanup.router.js
const express = require('express');
const router = express.Router();
const formatSetlist = require('../models/setlist.model');

// Change this to handle POST requests
router.post('/cleanup', async (req, res) => {
  console.log('Cleanup request fired off');
  
  // Assuming you have some data to format, you can pass it to the formatSetlist function
  const formattedData = formatSetlist(dataToFormat);
  
  // You can send back the formatted data as a response or perform other operations
  
  // Respond with the formatted data
  res.json(formattedData);
});

module.exports = router;
