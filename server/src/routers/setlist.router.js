const express = require('express');
const router = express.Router();
const setlistfmController = require('../controllers/setlistfm.controller'); // Import your controller

router.post('/searchSetlist', setlistfmController.searchSetlist); // Define the route

module.exports = setlistFmRouter;
