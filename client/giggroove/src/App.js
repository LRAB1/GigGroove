import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [setlistId, setSetlistId] = useState('');
  const [setlistData, setSetlistData] = useState(null);

  const handleSearchSetlist = async () => {
    if (!setlistId) {
      return; // Prevent empty input from making a request
    }

    try {
      // Make a POST request to your backend API route
      const response = await axios.post('http://localhost:3001/api/searchSetlist', { setlistId });

      // Update the state with the response data
      setSetlistData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      <h1>Welcome to Setlist Spotify App</h1>
      <p>Enter the Setlist.fm Setlist ID:</p>
      <input
        type="text"
        placeholder="Setlist.fm Setlist ID"
        value={setlistId}
        onChange={(e) => setSetlistId(e.target.value)}
      />
      <button onClick={handleSearchSetlist}>Search Setlist</button>

      {setlistData && (
        <div>
          <h2>Setlist Data</h2>
          <pre>{JSON.stringify(setlistData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
