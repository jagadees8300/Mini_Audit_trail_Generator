// server/src/controllers/versionController.js
const { v4: uuidv4 } = require('uuid');
const { calculateTextDifference } = require('../utils/diffLogic');

// In-memory storage for versions (as allowed by requirements)
let versions = [];

/**
 * Controller function to handle saving a new version of the text.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const saveVersion = (req, res) => {
    try {
        const { content } = req.body;

        if (typeof content !== 'string') {
            return res.status(400).json({ error: 'Request body must contain a string field named "content".' });
        }

        const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:mm:ss
        const newWordCount = content ? content.trim().split(/\s+/).filter(word => word.length > 0).length : 0;

        let oldWordCount = 0;
        let addedWords = [];
        let removedWords = [];

        if (versions.length > 0) {
            // Get the most recent version to compare against
            const previousVersion = versions[versions.length - 1];
            oldWordCount = previousVersion.newLength; // The old length for the new version is the new length of the previous version

            const diffResult = calculateTextDifference(previousVersion.content, content); // Pass the raw content strings
            addedWords = diffResult.addedWords;
            removedWords = diffResult.removedWords;
        } else {
            // If it's the first version, all words are considered "added"
            addedWords = content ? content.toLowerCase().split(/\s+/).filter(word => word.length > 0) : [];
        }

        const newVersionEntry = {
            id: uuidv4(), // Generate a unique ID
            timestamp: currentTimestamp,
            addedWords,
            removedWords,
            oldLength: oldWordCount,
            newLength: newWordCount,
            content // Store the full content for future diff comparisons
        };

        versions.push(newVersionEntry);

        // Respond with the summary object (excluding the full content for the response)
        const responseSummary = {
            id: newVersionEntry.id,
            timestamp: newVersionEntry.timestamp,
            addedWords: newVersionEntry.addedWords,
            removedWords: newVersionEntry.removedWords,
            oldLength: newVersionEntry.oldLength,
            newLength: newVersionEntry.newLength,
        };

        res.status(201).json(responseSummary); // Send back the summary

    } catch (error) {
        console.error('Error saving version:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Controller function to handle fetching all versions.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getVersions = (req, res) => {
    try {
        // Return the list of versions, excluding the full 'content' field for the history list
        const versionsForDisplay = versions.map(v => ({
            id: v.id,
            timestamp: v.timestamp,
            addedWords: v.addedWords,
            removedWords: v.removedWords,
            oldLength: v.oldLength,
            newLength: v.newLength,
        }));
        res.status(200).json(versionsForDisplay);
    } catch (error) {
        console.error('Error fetching versions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Controller function to handle deleting a specific version by ID.
 * @param {Object} req - Express request object (contains the ID in params).
 * @param {Object} res - Express response object.
 */
const deleteVersion = (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameter

        // Find the index of the version with the given ID
        const indexToDelete = versions.findIndex(v => v.id === id);

        if (indexToDelete === -1) {
            // If no version with the ID is found, return a 404 error
            return res.status(404).json({ error: 'Version not found' });
        }

        // Remove the version from the array
        versions.splice(indexToDelete, 1);

        // Respond with a success message
        res.status(200).json({ message: 'Version deleted successfully' });

    } catch (error) {
        console.error('Error deleting version:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Export the controller functions
module.exports = {
    saveVersion,
    getVersions,
    deleteVersion // Add the new function to the exports
};