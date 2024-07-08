const express = require('express');
const router = express.Router();
const setlistModel = require('../models/setlist.model');

// Define the route
router.post('/cleanup', (req, res) => {
  setlistModel.formatSetlist(); // Call the formatSetlist function
  console.log('Cleanup request fired off');
  res.status(200).json({ message: 'Cleanup successful' });
});

console.log('Made it to the cleanup router.');
module.exports = router;
