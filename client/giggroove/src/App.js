import React, { useState } from 'react';

function App() {
  const [setlistId, setSetlistId] = useState('');
  const [spotifyUsername, setSpotifyUsername] = useState('');

  const handleSearch = () => {
    // Handle the user's input, make API requests to setlist.fm and Spotify.
  };

  return (
    <div className="App">
      <h1>Welcome to Setlist Spotify App</h1>
      <p>Enter your desired setlist and Spotify login details.</p>
      <input
        type="text"
        placeholder="Setlist.fm Setlist ID"
        value={setlistId}
        onChange={(e) => setSetlistId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Spotify Username"
        value={spotifyUsername}
        onChange={(e) => setSpotifyUsername(e.target.value)}
      />
      <button onClick={handleSearch}>Search and Log In</button>
    </div>
  );
}

export default App;
