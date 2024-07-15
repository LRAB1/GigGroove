// spotify.auth.controller.js
const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const axios = require('axios');
const { spotifyClient, spotifyRedirectUri } = require('../../../keys');

const spotifyAuthRouter = express.Router();

// Function to generate a code verifier and its corresponding code challenge
const generateCodeChallenge = (codeVerifier) => {
  return crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// PKCE flow state
let codeVerifier = '';
let accessToken = '';
let refreshToken = '';

// Step 1: Redirect to Spotify Authorization URL
spotifyAuthRouter.get('/login', (req, res) => {
  codeVerifier = generateRandomString(128);
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);

  const scope = 'playlist-modify-private';

  const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: spotifyClient,
    scope: scope,
    redirect_uri: spotifyRedirectUri,
    state: state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  })}`;

  res.redirect(authURL);
});

// Step 2: Handle the callback from Spotify
spotifyAuthRouter.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect('/#/error/state_mismatch');
    return;
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: spotifyRedirectUri,
      client_id: spotifyClient,
      code_verifier: codeVerifier,
    }));

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;

    res.redirect('/#/success');
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.redirect('/#/error/invalid_token');
  }
});

// Step 3: Use the access token to make authenticated requests
spotifyAuthRouter.get('/me', async (req, res) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = spotifyAuthRouter;
