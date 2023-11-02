const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const spotifyServer = http.createServer((req, res) => {
  if (req.url === '/check') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Spotify Server is running');
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Not Found');
    res.end();
  }
});

spotifyServer.listen(3002, () => {
  console.log('Spotify Server is running on port 3002');
});