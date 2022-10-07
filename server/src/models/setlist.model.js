const fs = require('fs');
const { stringify } = require('querystring');

fs.readFile('../../data/raw-setlist.json', (err, setlist) => {
    if (err) throw err;
    const localsetlist = JSON.parse(setlist);
    console.log('Finished reading file.');
    //testSetlist.push(localsetlist);

    //Artist name gets pulled in json format.
    const artist = localsetlist.artist.name
    //console.log(artist);

    //Grabbing tour name for playlist naming.
    const tour = [];
    if (!localsetlist.tour) {
        console.log('No tour found.')
    } else tour.push(localsetlist.tour.name)
    //console.log(tour);

    //Check how many set arrays exist and therefore if an encore was performed.
    const amountSets = [];
    amountSets.push(localsetlist.sets.set.length);
    console.log('amount of sets', amountSets);

    //Grabbing songs and names. Needs to be made be smarter.
    const songs = [];
    if ([amountSets] !==0 ) {{ amountSets.forEach( element => amountSets.push(element));
    }else if ([amountSets] === 0 ) console.log('Information not known to SetlistFm')};


    //Create setlist.txt, containing artist, tourname and songlist(json unfortunately).
    fs.writeFileSync('../../data/setlist.txt', artist + "\r\n" +  tour + "\r\n" + JSON.stringify(songs,null, 4));

    /*if ([amountSets] == 0 ) {
        console.log('Information not known to SetlistFM.');
    }   else if  ([amountSets] == 1 ) {
        console.log('No encore was performed');
        songs.push(localsetlist.sets.set[0].song);
    }       else if ([amountSets] == 2 ) {
            console.log('An encore was performed');
            songs.push(localsetlist.sets.set[0].song);
            songs.push(localsetlist.sets.set[1].song);
        }       else if ([amountSets] == 3) {
                console.log('More than 2 sets?! Noice!')
                songs.push(localsetlist.sets.set[0].song);
                songs.push(localsetlist.sets.set[1].song);
                songs.push(localsetlist.sets.set[2].song);
                }  else if ([amountSets] == 4 ) {
                   console.log('More than 3 sets?! SHEESH')
                   songs.push(localsetlist.sets.set[0].song);
                   songs.push(localsetlist.sets.set[1].song);
                   songs.push(localsetlist.sets.set[2].song);
                   songs.push(localsetlist.sets.set[3].song);
    };
    //Create setlist.txt, containing artist, tourname and songlist(json unfortunately).
    fs.writeFileSync('../../data/setlist.txt', artist + "\r\n" +  tour + "\r\n" + JSON.stringify(songs,null, 4));
    //Create exportable object for communication towards streamingservice.
    module.exports = artist, tour, songs; //ugly and doesnt work.
}); */
});
//module.exports = extractedArtist, extractedSongs, extractedTour; //commented out for testing reasons