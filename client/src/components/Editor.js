// client/src/components/Editor.js
import React, { useState } from 'react';

const Editor = ({ onSaveVersion }) => {
    const [content, setContent] = useState(''); // State to hold the text area content
    const [isLoading, setIsLoading] = useState(false); // State to show loading status

    const handleSaveClick = async () => {
        if (isLoading) return; // Prevent multiple clicks while saving

        setIsLoading(true);
        try {
            // Call the parent component's function to handle saving
            await onSaveVersion(content);
            // Optionally clear the text area after saving
            // setContent(''); // Uncomment if you want to clear after saving
        } catch (error) {
            console.error('Error saving version:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="editor-container">
            <h2>Content Editor</h2>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your text here..."
                rows={8} // Adjust rows as needed
                cols={50} // Adjust cols as needed
                disabled={isLoading} // Disable input while saving
            />
            <br />
            <button onClick={handleSaveClick} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Version'}
            </button>
        </div>
    );
};

export default Editor;