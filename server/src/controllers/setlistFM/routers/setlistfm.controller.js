const axios = require('axios');

const SETLISTFM_URL = 'https://api.setlist.fm/rest/1.0/setlist/';
const {SETLIST_KEY} = require('../../../../../keys');
const iD = '23ba2c6f';

async function getSetlist() {

let data = '';

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${SETLISTFM_URL}${iD}`,
  headers: { 
    'x-api-key': SETLIST_KEY,
    'Accept': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
}

getSetlist();

module.exports = {
  getSetlist,
};