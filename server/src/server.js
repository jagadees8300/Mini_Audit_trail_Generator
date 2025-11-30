// server/src/server.js
const app = require('./app');

const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});