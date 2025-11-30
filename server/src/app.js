// server/src/app.js
const express = require('express');
const cors = require('cors'); // Import CORS middleware
// Make sure you are importing the versionRoutes
const versionRoutes = require('./routes/versionRoutes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Routes: All version-related routes will be prefixed with /api
// This line connects the routes defined in versionRoutes.js to the /api path
app.use('/api', versionRoutes);

// Basic root route for testing
app.get('/', (req, res) => {
    res.send('Mini Audit Trail Generator Backend API is running!');
});

module.exports = app; // Export the app instance