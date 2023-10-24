const https = require('follow-redirects').https;
const fs = require('fs');
const { setlistFmKey } = require('../../../keys');


const retrievedSetlist = [];

const searchSetlist = async (iD) => {
  const options = {
    method: 'GET',
    hostname: 'api.setlist.fm',
    path: `/rest/1.0/setlist/${iD}`,
    headers: {
      accept: 'application/json',
      'x-api-key': setlistFmKey,
    },
    maxRedirects: 20,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        const setlistData = body.toString();

        // Push the setlist data to retrievedSetlist
        retrievedSetlist.push(setlistData);

        // Log the response for debugging
        console.log(retrievedSetlist[0]);

        resolve(setlistData);
      });

      res.on('error', function (error) {
        reject(error);
      });
    });

    req.end();
  });
};

module.exports = {
  searchSetlist,
  retrievedSetlist,
};