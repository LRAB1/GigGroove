const fs = require('fs');
const path = require('path');

const setlistData = require('../../data/raw-setlist.json');

function formatSetlist(setlistData) {
  if (!setlistData || !setlistData.artist || !setlistData.venue) {
    return null; // Handle the case when setlistData is undefined or missing properties
  }

  const artist = setlistData.artist.name;
  const venue = setlistData.venue.name;
  const tour = setlistData.tour ? setlistData.tour.name : `${venue}`;
  const sets = setlistData.sets.set;

  const songs = sets.map((set, index) => {
    const setNumber = index + 1;
    const setSongs = set.song.map((song) => song.name);

    return {
      setNumber,
      songs: setSongs,
    };
  });

  const output = `const artist = "${artist}";
const venue = "${venue}";
const tour = "${tour}";
const songs = ${JSON.stringify(songs, null, 2)};

module.exports = { artist, venue, tour, songs };`;

  return output;
}

const output = formatSetlist(setlistData);

if (output) {
  const outputPath = path.join(__dirname, '../../data/setlist.js');
  fs.writeFileSync(outputPath, output);
  console.log(`Setlist saved to ${outputPath}`);
}

module.exports = { formatSetlist }; // Exporting as an object
