const fs = require('fs');

//TODO: add date to setlist.js export and the ability to check for more than 1 encore and more than 1 set of songs.

fs.readFile('../../data/raw-setlist.json', (err, setlist) => {
  if (err) throw err;
  const localsetlist = JSON.parse(setlist);

  let artist = '';
  if (localsetlist.artist && localsetlist.artist.name) {
    artist = `"${localsetlist.artist.name}"`;
  } else {
    console.log('No artist found');
  }

  let tour = '';
  if (localsetlist.tour && localsetlist.tour.name) {
    tour = `"${localsetlist.tour.name}"`;
  } else {
    console.log('No tour found');
  }

  let songs = '';
  if (localsetlist.sets && Array.isArray(localsetlist.sets.set) && localsetlist.sets.set.length > 0) {
    const set = localsetlist.sets.set[0];
    songs = set.song.map(song => `"${song.name}"`).join(', ');
  } else {
    console.log('No songs found');
  }

  let venue = '';
  if (localsetlist.venue && localsetlist.venue.name) {
    venue = `"${localsetlist.venue.name}"`;
    } else {
      console.log('No venue found');
    }

//TODO: Get the date and add to output.
  /*let date = '';
    if (localsetlist.eventDate) {
      venue = `"${localsetlist.eventDate}"`;
      console.log(date);
      } else {
        console.log('No date found');
      }*/

  const output = `const artist = ${artist};
const venue = ${venue};
const tour = ${tour};
const songs = [${songs}];

module.exports = { artist, venue, tour, songs };`;

  fs.writeFileSync('../../data/setlist.js', output);
});
