const https = require('https');
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyRedirectUri } = require('../../../keys');
const express = require('express');

//Implementing OAuth2 flow from spotify.api.
//TODO: determine if this requires a router to activate.

