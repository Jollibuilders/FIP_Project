import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    axios
      .get('http://localhost:3000') 
      .then((response) => {
        setBackendData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          FIP Project Starter
        </h1>
        <button
          onClick={fetchData}
          className={`px-6 py-3 text-white font-bold rounded-lg transition ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch Data'}
        </button>
        <div className="mt-6">
          {backendData ? (
            <p className="text-gray-700">
              <span className="font-semibold">Response:</span>{' '}
              {JSON.stringify(backendData)}
            </p>
          ) : (
            <p className="text-gray-500">No data fetched yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
