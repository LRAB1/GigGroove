const axios = require('axios');
const fs = require('fs');
const {setlistFmKey} = require('../../../keys.js')

const urlWithoutId = "https://api.setlist.fm/rest/1.0/setlist/";
const iD = '3bb3acc4'; //Setlist Afas Devin 4bb7d3c2

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: urlWithoutId + iD,
  headers: { 
    'accept': 'application/json', 
    'x-api-key': setlistFmKey
  }
};

axios.request(config)
  .then((response) => {
    fs.writeFile('../../data/raw-setlist.json', JSON.stringify(response.data, null, 2), (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  })
  .catch((error) => {
    console.log(error);
  });