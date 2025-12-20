// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files if needed
app.use(express.static(path.join(__dirname, "public")));

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to MacroAI! Your professional AI assistant is running.");
});

// AI chat endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Simple professional responses (you can expand this later)
  let response;

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("elon musk")) {
    response = "Elon Musk is a technology entrepreneur, investor, and engineer. He is the CEO of SpaceX and Tesla, and is known for his work in advancing electric vehicles, space exploration, and renewable energy.";
  } else if (lowerMessage.includes("who are you")) {
    response = "I am MacroAI, your professional AI assistant designed to provide accurate and clear information.";
  } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    response = "Hello! How can I assist you today?";
  } else {
    response = "I’m here to help! Could you please provide more details or ask a specific question?";
  }

  res.json({ reply: response });
});

// Start server
app.listen(PORT, () => {
  console.log(`MacroAI server is running on port ${PORT}`);
});
