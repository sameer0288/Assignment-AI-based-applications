const express = require("express");
const api = require("./api");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for security-related HTTP headers
app.use(helmet());

// Middleware to parse JSON data
app.use(express.json());

// Use CORS middleware to allow requests from all origins
app.use(cors());

app.post("/api/search", api.search);

// Custom error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
