const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');
const { setlistFmKey } = require('../../../keys');

//Create an array for debugging purposes, it shows the retrieved setlist.
const retrievedSetlist = [];

const searchSetlist = async (iD) => {
  // Define the options for the Setlist.fm API request
  const options = {
    method: 'GET',
    hostname: 'api.setlist.fm',
    path: `/rest/1.0/setlist/${iD}`,
    headers: {
      accept: 'application/json',
      'x-api-key': setlistFmKey, //Needs setlistFmKey from keys.js
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

        try {
          // Parse the setlistData to ensure it's valid JSON
          const parsedSetlistData = JSON.parse(setlistData);

          // Push the parsed setlist data to retrievedSetlist
          retrievedSetlist.push(parsedSetlistData);

          // Log the response for debugging
          console.log(retrievedSetlist[0]);

          // Export the retrievedSetlist to a JSON file
          exportRetrievedSetlist();

          resolve(setlistData);
        } catch (error) {
          console.log(error); //Catch the error and log it, debugging made easy.
        }
      });

      res.on('error', function (error) {
        console.log(error); //Catch the error and log it, debugging made easy.
      });
    });

    req.end();
  });
};

const exportRetrievedSetlist = () => {
  const outputPath = path.join(__dirname, '../../data/raw-setlist.json');

  try {
    // Write the retrievedSetlist to a JSON file
    fs.writeFileSync(outputPath, JSON.stringify(retrievedSetlist, null, 2));
    console.log(`Retrieved Setlist saved to ${outputPath}`);
  } catch (error) {
    console.error(`Error while saving retrieved Setlist: ${error.message}`);
  }
};

module.exports = {
  searchSetlist,
  retrievedSetlist,
};
