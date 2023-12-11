const fs = require('fs');
const path = require('path');

let initialized = false;

function formatSetlist() {
  if (initialized) {
    return;
  }

  let setlistData;

  try {
    // Synchronously read the setlist data
    const rawData = fs.readFileSync(path.join(__dirname, '../../data/raw-setlist.json'), 'utf8');
    setlistData = JSON.parse(rawData);
    console.log('Made it 0');
    console.log('Setlist Data:', setlistData); // Log the setlist data
  } catch (error) {
    console.log('Error reading setlist data:', error.message);
    return null;
  }

  // Check if setlistData is an array and contains at least one element
  if (!Array.isArray(setlistData) || setlistData.length === 0 || !setlistData[0].artist || !setlistData[0].venue) {
    console.log('Made it 1');
    return null;
  }

  const artist = setlistData[0].artist.name;
  const venue = setlistData[0].venue.name;
  const tour = setlistData[0].tour ? setlistData[0].tour.name : `${venue}`;
  const sets = setlistData[0].sets.set;

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

  try {
    const outputPath = path.join(__dirname, '../../data/setlist.js');
    console.log('Output Path:', outputPath); // Log the output path
    fs.writeFileSync(outputPath, output);
    console.log(`Setlist saved to ${outputPath}`);
  } catch (error) {
    console.error(`Error while saving Setlist: ${error.message}`);
  }

  console.log('Made it 4');

  initialized = true;
}

// Call the formatSetlist function (initialize function)
formatSetlist();

// Export the formatSetlist function for external use
module.exports = { formatSetlist };
