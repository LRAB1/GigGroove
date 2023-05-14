const fs = require('fs');

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

  const output = `const artist = ${artist};
const tour = ${tour};
const songs = [${songs}];`;

  fs.writeFileSync('../../data/setlist.js', output);
});
