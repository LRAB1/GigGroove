const https = require('https');
const SpotifyWebApi = require('spotify-web-api-node');
const { spotifyClient, spotifySecret, spotifyRedirectUri } = require('../../../keys');
const express = require('express');

const codeVerifier = generateRandomString(64);
const hashed = await hash(codeVerifier);
const codeChallenge = base64encode(hashed);

//Implementing OAuth2 flow from spotify.api.
//TODO: determine if this requires a router to activate.
//TODO: test functionality. Probably still needs the GET for authing.

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };
  
  const hash = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }
  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };
