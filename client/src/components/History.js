// client/src/components/History.js
import React from 'react';

const History = ({ versions, onDeleteVersion }) => { // Receive only the onDeleteVersion function as a prop
    if (!versions || versions.length === 0) {
        return <div className="history-container"><h2>Version History</h2><p>No versions saved yet.</p></div>;
    }

    return (
        <div className="history-container">
            <h2>Version History</h2>
            <ul className="version-list">
                {versions.map((version) => (
                    <li key={version.id} className="version-item">
                        <p><strong>Time:</strong> {version.timestamp}</p>
                        <p><strong>ID:</strong> {version.id}</p>
                        <p><strong>Words Added:</strong> {version.addedWords.length > 0 ? version.addedWords.join(', ') : 'None'}</p>
                        <p><strong>Words Removed:</strong> {version.removedWords.length > 0 ? version.removedWords.join(', ') : 'None'}</p>
                        <p><strong>Word Count:</strong> {version.oldLength} → {version.newLength}</p>
                        {/* Delete button for individual items, inside the list item */}
                        <button onClick={() => onDeleteVersion(version.id)} className="delete-btn">
                            Delete
                        </button>
                        <hr /> {/* Optional separator */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;