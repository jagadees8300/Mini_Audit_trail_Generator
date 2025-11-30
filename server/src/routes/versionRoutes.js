// server/src/routes/versionRoutes.js
const express = require('express');
const router = express.Router();
// Make sure you are importing deleteVersion
const { saveVersion, getVersions, deleteVersion } = require('../controllers/versionController');

// POST route to save a new version
router.post('/save-version', saveVersion);

// GET route to retrieve the version history
router.get('/versions', getVersions);

// DELETE route to remove a specific version by ID
// This is the crucial line - it must match the URL pattern
router.delete('/versions/:id', deleteVersion);

module.exports = router;