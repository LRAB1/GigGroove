const https = require('follow-redirects').https;
const fs = require('fs');
const { setlistFmKey } = require('../../../keys');

const retrievedSetlist = [];
const iD = '4bb7d3c2';

const options = {
  method: 'GET',
  hostname: 'api.setlist.fm',
  path: `/rest/1.0/setlist/${iD}`,
  headers: {
    accept: 'application/json',
    'x-api-key': setlistFmKey
  },
  maxRedirects: 20
};

const getRequest = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        resolve(body.toString());
      });

      res.on('error', function (error) {
        reject(error);
      });
    });

    req.end();
  });
};

(async () => {
  try {
    const body = await getRequest();
    retrievedSetlist.push(body);
    console.log(retrievedSetlist[0]);
  } catch (error) {
    console.error(error);
  }
})();