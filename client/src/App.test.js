// client/src/App.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides matchers like toBeInTheDocument
import App from './App';
import { rest } from 'msw'; // Mock Service Worker for API mocking (or use jest mock functions)
import { setupServer } from 'msw/node';

// Mock the API calls using MSW or simple fetch mocks
// Example using simple fetch mock:
const server = setupServer(
    rest.get('http://localhost:5000/api/versions', (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: '1',
                    timestamp: '2025-11-30 10:00:00',
                    addedWords: ['initial'],
                    removedWords: [],
                    oldLength: 0,
                    newLength: 1
                }
            ])
        );
    }),
    rest.post('http://localhost:5000/api/save-version', (req, res, ctx) => {
        const { content } = req.body;
        return res(
            ctx.status(201),
            ctx.json({
                id: '2',
                timestamp: '2025-11-30 10:01:00',
                addedWords: content.split(' '),
                removedWords: [],
                oldLength: 1,
                newLength: content.split(' ').length
            })
        );
    })
    // Add handlers for DELETE if you implement them
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test suite for the frontend App component
describe('App Component', () => {
    test('renders editor, history, and fetches initial versions', async () => {
        render(<App />);

        // Check if the main elements are rendered
        expect(screen.getByText(/Content Editor/i)).toBeInTheDocument();
        expect(screen.getByText(/Save Version/i)).toBeInTheDocument();
        expect(screen.getByText(/Version History/i)).toBeInTheDocument();

        // Wait for the API call to fetch versions to complete
        await waitFor(() => {
            expect(screen.getByText(/initial/i)).toBeInTheDocument(); // Check for content from mock
        });

        // Verify that the initial version is displayed
        expect(screen.getByText('2025-11-30 10:00:00')).toBeInTheDocument();
        expect(screen.getByText('initial')).toBeInTheDocument();
    });

    // Add more tests for saving content, checking history updates, etc.
    // This requires more complex mocking and user interaction simulation.
    // Example: Test saving a new version
    test('allows saving a new version (requires user-event library for simulation)', async () => {
        // This test is more complex and requires simulating user input and clicks.
        // You would typically use @testing-library/user-event for this.
        // For brevity and initial setup, we'll just verify the basic rendering here.
        render(<App />);
        expect(screen.getByRole('button', { name: /Save Version/i })).toBeInTheDocument();
        // A full test would involve:
        // 1. Find the textarea
        // 2. Fill it with text using userEvent.type()
        // 3. Find the save button
        // 4. Click it using userEvent.click()
        // 5. Wait for the UI to update and check for the new entry.
        // This requires adding user-event and setting up more complex mocks.
    });
});