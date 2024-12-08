const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');
const { setlistFmKey } = require('../../../keys');
const express = require('express');

const app = express();

const SETLISTFM_URL = 'https://setlist.fm/1.0/setlist/';

//Create an array for debugging purposes, it shows the retrieved setlist.
const retrievedSetlist = [];

async function searchSetlist (req, res) {
  try {
    return await fetch (`${SETLISTFM_URL}/${iD}`, {
      
    }})
  }
};

module.exports = {
  searchSetlist,
  retrievedSetlist,
};
