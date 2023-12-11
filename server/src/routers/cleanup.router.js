// cleanup.router.js
const express = require('express');
const router = express.Router();
const setlistModel = require('../models/setlist.model');
const { formatSetlist} = require('../models/setlist.model');

router.post('/cleanup', setlistModel.formatSetlist); // Define the route
console.log('Made it to the cleanup router.')
module.exports = router;
