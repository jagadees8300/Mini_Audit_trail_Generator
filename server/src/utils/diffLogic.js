// server/src/utils/diffLogic.js

/**
 * Calculates the difference between two strings of text in terms of added and removed words.
 * @param {string} oldText - The previous version of the text.
 * @param {string} newText - The new version of the text.
 * @returns {Object} An object containing arrays of addedWords and removedWords.
 */
function calculateTextDifference(oldText, newText) {
    // Convert text strings into arrays of words, converting to lowercase for case-insensitive comparison
    // A simple split by whitespace is sufficient for this task.
    const oldWords = oldText ? oldText.toLowerCase().split(/\s+/).filter(word => word.length > 0) : [];
    const newWords = newText ? newText.toLowerCase().split(/\s+/).filter(word => word.length > 0) : [];

    // Create Sets for faster lookup
    const oldWordSet = new Set(oldWords);
    const newWordSet = new Set(newWords);

    // Find words present in new but not in old (Added words)
    const addedWords = [...newWordSet].filter(word => !oldWordSet.has(word));

    // Find words present in old but not in new (Removed words)
    const removedWords = [...oldWordSet].filter(word => !newWordSet.has(word));

    return { addedWords, removedWords };
}

module.exports = { calculateTextDifference };