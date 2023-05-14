//TODO: determine if this needs to create a local file? Perhaps it is smarter to already get this data while making the request and collecting song names etc without this file.

const fs = require('fs');
const { stringify } = require('querystring');
const { isArray } = require('util');

fs.readFile('../../data/raw-setlist.json', (err, setlist) => {
    if (err) throw err;
    const localsetlist = JSON.parse(setlist);
    console.log('Finished reading file.');

    //Artist name gets pulled in json format.
    const artist = [];
    if (!localsetlist.artist.name) {
        console.log('No artist found')
    } else /*artist.push(localsetlist.artist.name),*/ artist.push(localsetlist.artist.name);
    //console.log(artist);

    //Grabbing tour name for playlist naming.
    const tour = [];
    if (!localsetlist.tour) {
        console.log('No tour found.')
    } else tour.push(localsetlist.tour.name)
    //console.log(tour);

    //Check how many set arrays exist, used as indicator for songs function
    const amountSets = [];
    if (localsetlist.sets.set.length === 0 ) {
        console.log('No sets found')
        //perhaps jump the songs routine?
    } else amountSets.push(localsetlist.sets.set.length);
    //console.log('amount of sets', amountSets);

    //Extracting songs and pushing to txt file, dumb but works.
    const songs = [];
     if (amountSets !==0 ) {
        songs.push(localsetlist.sets.set[0]);
        songs.push(localsetlist.sets.set[1]);
        songs.push(localsetlist.sets.set[2]);
        songs.push(localsetlist.sets.set[3]);
        songs.push(localsetlist.sets.set[4]);
    }   else console.log('Data not known to SetlistFm');

    //Create setlist.txt, containing artist, tourname and songlist(json unfortunately).
    fs.writeFileSync('../../data/setlist.txt', artist + "\r\n" +  tour + "\r\n" + JSON.stringify(songs,null, 4));
});