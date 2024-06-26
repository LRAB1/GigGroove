//TODO: get the spotifyClient and Secret from the controller and not hardcode it.
//for dev purposes this works but should be made into a filling variable.
const setlistFmKey = ''
const spotifyClient= '' //TODO: deprecate by using it's variable in auth flow.
const spotifySecret = '' //TODO: deprecate by using it's variable in auth flow.
const spotifyRedirectUri = '' //Hardcoded for ease of use with the requirement from Spotify their API.

module.exports = {setlistFmKey,spotifyClient,spotifySecret,spotifyRedirectUri};