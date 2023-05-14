const fs = require('fs');

//Import artist, tour and songs from txt file.
fs.createReadStream('../../data/setlist.txt')



console.log(`Artist: ${artist} Tour: ${tour} Songs: ${songs}`);