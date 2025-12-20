// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from "public" folder (if you have one)
app.use(express.static(path.join(__dirname, "public")));

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World! Your server is running.");
});

// Example API route
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
