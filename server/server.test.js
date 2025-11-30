// server/server.test.js
const request = require('supertest');
const app = require('./src/app'); // Import your main Express app instance
const { calculateTextDifference } = require('./src/utils/diffLogic');

// Test suite for the backend API
describe('Mini Audit Trail Generator API', () => {
    let versions = []; // Simulate the in-memory storage used by the controller
    // Note: This mocking strategy might be complex for in-memory state.
    // A simpler approach might be to test without mocking the global state
    // or use an in-memory DB for tests. For now, let's assume the default export
    // doesn't directly reference a global 'versions' array in the module cache during tests,
    // which might not be the case depending on how Node.js handles it.

    // Alternative: Don't mock globally, just test the endpoints as they are,
    // understanding state will persist across tests within this file if not reset properly
    // by the server logic itself (which it should be via API calls).

    // For this example, we'll proceed with the test structure,
    // acknowledging the mock might need refinement for true isolation.

    // Mocking the controller's versions array *before* importing the app
    // can be tricky. Let's try a simpler approach first: just test the endpoints.
    // The in-memory state will be reset if the server instance is fresh per test,
    // or if the API calls correctly manage state.

    // For now, let's remove the complex mocking and see if basic endpoint tests work.
    // If state isolation is needed per test, more complex setup might be required.

    // Let's keep the tests but note that state might carry over between tests
    // if the server instance isn't reloaded. Jest runs tests within the same process
    // by default, so the in-memory 'versions' array in your controller will persist.

    // A common practice is to reset the state in beforeEach, but since it's in the controller module,
    // mocking becomes necessary, or the controller logic needs to be designed differently
    // for easier testing (e.g., dependency injection).

    // For this specific case, let's assume the tests run sequentially and reset the
    // server's state via API calls or by resetting the module's internal state if possible.
    // The most robust way is often to have a separate test database or use an in-memory
    // instance that's recreated, but for simplicity with in-memory, we might need to be careful.

    // Let's run the tests and see if the initial setup works.
    // If it fails due to state, we'll need to mock the controller's 'versions' array properly.

    // Attempting a simpler mock strategy:
    jest.mock('./src/controllers/versionController', () => {
        const actualController = jest.requireActual('./src/controllers/versionController');
        // Create a new, empty array for each test file run (or each test if done in beforeEach)
        const testVersions = [];
        // Return a new object that overrides the default exported functions
        // but uses the testVersions array
        // This is complex because the original controller holds 'versions' as a closure variable.
        // The original code exports functions that close over the 'versions' variable.
        // To mock it, we'd need to mock the variable itself, which is tricky.
        // A better approach might be to structure the controller to accept the storage as a dependency.

        // For now, let's assume the simplest case where the app's route handlers
        // use the functions from the controller as they are, and the state lives in the controller.
        // Jest's module cache means the first import of the controller will be used.
        // To reset state, we'd need to clear the cache or mock the controller's internal variable.

        // Let's try clearing the module cache for the controller in beforeEach if needed.
        // For the first run, let's see if it works without complex mocking.

        return actualController; // Start with the actual controller
    });

    // If the above doesn't reset state, we might need something like this in a beforeEach:
    // beforeEach(() => {
    //   jest.resetModules(); // This reloads modules, potentially resetting state
    //   app = require('./src/app'); // Reload app after resetting modules
    //   // Access the controller's versions array if possible to reset it directly
    //   // This is difficult with the current structure.
    //   // A better structure would involve passing state management as a dependency.
    // });

    // For now, let's run the tests assuming state doesn't interfere with the initial checks.
    // We'll focus on the first test which saves a version.

    // Note: The test for differences relies on the previous state. If the first test saves a version,
    // the second test will see it. This is okay if we control the sequence or reset state correctly.
    // The simplest reset is to ensure the server starts fresh for the test suite,
    // which Jest usually does implicitly, but the in-memory variable persists within the module.

    // Let's run the tests as they are and see the error message.
    // If it's related to module loading or syntax, the Babel config should fix it.
    // If it's related to state, we'll need the mock.

    // --- Test Cases ---

    describe('POST /api/save-version', () => {
        // Clear the module cache for the controller before each test to reset state
        beforeEach(() => {
            jest.resetModules();
            // Reload app and potentially controller state
            // This is the most reliable way to reset the 'versions' array in the controller
            // if it's defined as a module-level variable.
        });

        it('should save a new version successfully and return the summary', async () => {
            // Reload the app instance after resetting modules to get fresh controller state
            const freshApp = require('./src/app');

            const initialContent = "This is the initial content.";

            const response = await request(freshApp)
                .post('/api/save-version')
                .send({ content: initialContent })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('timestamp');
            // Note: addedWords might contain duplicates if the word appears multiple times
            // The original diff logic handles this by using Sets, so it should be unique words added.
            const expectedAddedWords = initialContent.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            expect(response.body.addedWords.sort()).toEqual(expectedAddedWords.sort());
            expect(response.body.removedWords).toEqual([]);
            expect(response.body.oldLength).toBe(0);
            expect(response.body.newLength).toBe(initialContent.trim().split(/\s+/).filter(w => w.length > 0).length);
        });

        // Note: Testing differences requires the state to be set up correctly by previous saves.
        // With module reset, this test might run in isolation.
        // We would need to save the first version within this test or not reset modules
        // and accept tests run in sequence.
        // For true isolation, dependency injection or an external state manager is better.
        // For this task, let's run without module reset for this specific test
        // and acknowledge the dependency on the first test or previous state.

        // To make it independent, we can perform the first save within this test.
        it('should detect differences between versions correctly', async () => {
            // Reload the app instance to start fresh for this test case too
            const freshApp = require('./src/app');

            const content1 = "This is the initial content.";
            const content2 = "This is the updated content with changes.";

            // Save first version within this test
            await request(freshApp)
                .post('/api/save-version')
                .send({ content: content1 });

            // Save second version
            const response = await request(freshApp)
                .post('/api/save-version')
                .send({ content: content2 })
                .expect(201);

            // Calculate expected diff using the utility function
            const diffResult = calculateTextDifference(content1, content2);
            const expectedOldLength = content1.trim().split(/\s+/).filter(w => w.length > 0).length;

            // Use .sort() to compare arrays regardless of order
            expect(response.body.addedWords.sort()).toEqual(diffResult.addedWords.sort());
            expect(response.body.removedWords.sort()).toEqual(diffResult.removedWords.sort());
            expect(response.body.oldLength).toBe(expectedOldLength);
            expect(response.body.newLength).toBe(content2.trim().split(/\s+/).filter(w => w.length > 0).length);
        });

        it('should return 400 if content is not provided or not a string', async () => {
            const freshApp = require('./src/app'); // Use fresh app instance

            await request(freshApp)
                .post('/api/save-version')
                .send({}) // No content
                .expect(400);

            await request(freshApp)
                .post('/api/save-version')
                .send({ content: 123 }) // Non-string content
                .expect(400);
        });
    });

    describe('GET /api/versions', () => {
        // This test also needs a fresh state or the state set up by previous saves.
        // Using a fresh app instance and relying on API calls to manage state.
        // If no versions are saved, it should return empty.
        it('should return an empty array initially', async () => {
            // Reload the app instance to start fresh
            const freshApp = require('./src/app');

            const response = await request(freshApp)
                .get('/api/versions')
                .expect(200);

            expect(response.body).toEqual([]);
        });

        // This test depends on saving versions first.
        it('should return the list of saved versions (without full content)', async () => {
             // Reload the app instance to start fresh for this test
            const freshApp = require('./src/app');

            const content1 = "First version.";
            const content2 = "Second version.";

            // Save two versions within this test
            await request(freshApp)
                .post('/api/save-version')
                .send({ content: content1 });
            await request(freshApp)
                .post('/api/save-version')
                .send({ content: content2 });

            const response = await request(freshApp)
                .get('/api/versions')
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('timestamp');
            expect(response.body[0]).toHaveProperty('addedWords');
            expect(response.body[0]).toHaveProperty('removedWords');
            expect(response.body[0]).toHaveProperty('oldLength');
            expect(response.body[0]).toHaveProperty('newLength');
            // Ensure the full 'content' field is not present in the list
            expect(response.body[0]).not.toHaveProperty('content');
        });
    });

    // Note on State Isolation:
    // The above tests use jest.resetModules() and reload the app instance
    // to try and isolate state. This should work if the 'versions' array is a simple
    // module-level variable in the controller. If the state still persists incorrectly,
    // the controller logic itself might need refactoring for better testability
    // (e.g., accepting the storage mechanism as an argument).
});