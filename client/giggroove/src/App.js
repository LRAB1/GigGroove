// App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [setlistId, setSetlistId] = useState('');
  const [setlistData, setSetlistData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearchSetlist = async () => {
    if (!setlistId) {
      return; // Prevent empty input from making a request
    }

    try {
      // Make a POST request to the /api/searchSetlist route
      //TODO: determine if we should just call the router instead of making a POST to the route.
      const response = await axios.post('http://localhost:3001/api/searchSetlist', { setlistId });

      // Check if the response contains setlist data
      if (response.data) {
        setSetlistData(response.data);
        setErrorMessage(''); // Clear any previous error message
      } else {
        setSetlistData(null);
        setErrorMessage('Setlist not found');
      }
    } catch (error) {
      console.error(error);
      setSetlistData(null);
      setErrorMessage('Setlist not found');
    }
  }

  const handleSetlistCleanup = async () => {
    try {
      // Make a POST request to the /api/cleanup route
      //TODO: determine if we should just call the route/function instead of making a POST to the route.
      const response = await axios.post('http://localhost:3030/api/cleanup');

      // Check the response and handle it accordingly
      if (response.data && response.data.message === 'Cleanup successful') {
        setErrorMessage('Cleanup successful');
      } else {
        setErrorMessage('Cleanup failed. An error occurred.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Cleanup failed. An error occurred.');
    }
  }

  const handleGroovify = async () => {
    // Redirect the user to localhost:3002
    window.location.href = 'http://localhost:3031';
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

      {errorMessage && (
        <div>
          <h2>{errorMessage}</h2>
        </div>
      )}

      {setlistData && !setlistData.code ? (
        <div>
          <h2>Setlist Data: found</h2>
          <button onClick={handleSetlistCleanup}>Cleanup Setlist</button>
          <button onClick={handleGroovify}>Groovify</button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
