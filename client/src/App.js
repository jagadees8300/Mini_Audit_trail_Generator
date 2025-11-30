// client/src/App.js
import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import History from './components/History';
import './App.css'; // Import your CSS file

// Define the base URL for your backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
    const [versions, setVersions] = useState([]);
    const [error, setError] = useState(null);
    const [titleAnimated, setTitleAnimated] = useState(false); // State to track if title animation has run

    // Effect to trigger title animation on initial mount
    useEffect(() => {
        // Set a small timeout to ensure the component has rendered before applying the class
        const timer = setTimeout(() => {
            setTitleAnimated(true);
        }, 10); // A tiny delay ensures the class is added after initial render

        return () => clearTimeout(timer); // Cleanup the timer if component unmounts quickly
    }, []); // Empty dependency array ensures this runs only once on mount

    const fetchVersions = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/versions`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setVersions(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching versions:', err);
            setError('Failed to load version history.');
            setVersions([]);
        }
    };

    const handleSaveVersion = async (content) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/save-version`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newVersionSummary = await response.json();
            console.log('Version saved successfully:', newVersionSummary);
            await fetchVersions(); // Refetch to update the UI

        } catch (err) {
            console.error('Error saving version:', err);
            setError('Failed to save version.');
            throw err; // Re-throw to let the Editor component handle its loading state
        }
    };

    // Function to call the backend's DELETE endpoint for a single version
    const handleDeleteVersion = async (id) => {
        try {
            console.log(`Sending DELETE request for ID: ${id}`); // Debug log
            // Construct the URL by appending the ID to the base URL and endpoint path
            const response = await fetch(`${API_BASE_URL}/api/versions/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                // Handle potential errors from the backend (e.g., 404 Not Found)
                const errorData = await response.json();
                console.error(`Backend error: ${errorData.error || 'Unknown error'}`); // Debug log
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            console.log('Delete request successful, fetching updated list...'); // Debug log

            // If deletion was successful, refetch the updated list from the backend
            await fetchVersions(); // This will update the 'versions' state
            console.log('Version deleted successfully, state updated'); // Debug log

        } catch (err) {
            console.error('Error deleting version:', err);
            setError(`Failed to delete version: ${err.message}`);
            // Optionally, refetch versions again to ensure UI is in sync if the error was temporary
            // await fetchVersions();
        }
    };

    useEffect(() => {
        fetchVersions();
    }, []);

    return (
        <div className="App">
            {/* Apply the animation class based on state */}
            <header className={`App-header ${titleAnimated ? 'animate-title' : ''}`}>
                {/* The h1 inside will inherit the animation */}
                <h1>Mini Audit Trail Generator</h1>
            </header>
            <main>
                {error && <div className="error-message">Error: {error}</div>}
                <Editor onSaveVersion={handleSaveVersion} />
                {/* Pass only the individual delete handler to the History component */}
                <History versions={versions} onDeleteVersion={handleDeleteVersion} />
            </main>
        </div>
    );
}

export default App;