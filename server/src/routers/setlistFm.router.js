// setlistFm.router.js
const express = require('express');
const router = express.Router();
const formatSetlist = require('../models/setlist.model');

// Change this to handle GET requests
router.get('/groovify', (req, res) => {
  // Handle the GET request logic here
  // You can use the formatSetlist function to format the setlist data
});

module.exports = router;
