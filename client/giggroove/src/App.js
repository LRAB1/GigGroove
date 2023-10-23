import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [setlistId, setSetlistId] = useState('');
  const [spotifyUsername, setSpotifyUsername] = useState('');

  const handleSearch = () => {
    // Assuming your backend API endpoint for Setlist.fm is '/api/setlistfm'
    axios.post('/api/setlistfm', { setlistId })
      .then(response => {
        // Handle the response from your backend here, e.g., set data in your state.
        // You can also perform Spotify login or any other actions as needed.
      })
      .catch(error => {
        // Handle any errors.
      });
  };

  return (
    <div className="App">
      <h1>Welcome to GigGroove</h1>
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
