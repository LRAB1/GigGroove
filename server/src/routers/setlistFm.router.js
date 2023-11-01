// setlistFm.router.js
const express = require('express');
const router = express.Router();
const formatSetlist = require('../models/setlist.model');

// Change this to handle GET requests
router.post('/groovify', formatSetlist, (req, res) => {
console.log('Groovify request fired off')
});

module.exports = formatSetlist;
