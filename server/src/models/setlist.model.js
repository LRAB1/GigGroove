// setlist.model.js

function formatSetlist(setlistData) {
  const artist = setlistData.artist.name;
  const venue = setlistData.venue.name;
  const tour = setlistData.tour ? setlistData.tour.name : `${venue}`; // Check if setlistData.tour exists
  const sets = setlistData.sets.set;

  const songs = sets.map((set, index) => {
    const setNumber = index + 1;
    const setSongs = set.song.map((song) => song.name);

    return {
      setNumber,
      songs: setSongs,
    };
  });

  const formattedData = {
    artist,
    venue,
    tour,
    songs,
  };

  return formattedData;
}

module.exports = formatSetlist;
