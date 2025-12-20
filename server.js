// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so frontend can call the API
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Chat endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  const lowerMessage = message.toLowerCase();
  let reply;

  // Professional AI-like responses
  if (lowerMessage.includes("elon musk")) {
    reply =
      "Elon Musk is a technology entrepreneur, engineer, and investor. He is the CEO of SpaceX and Tesla, and is known for his work in space exploration, electric vehicles, and renewable energy.";
  } else if (lowerMessage.includes("who are you")) {
    reply =
      "I am MacroAI, your professional AI assistant designed to provide accurate and clear information.";
  } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    reply = "Hello! How can I assist you today?";
  } else if (lowerMessage.includes("help")) {
    reply =
      "You can ask me questions about technology, famous personalities, or general knowledge, and I will provide professional responses.";
  } else {
    reply =
      "I’m here to help! Could you please provide more details or ask a specific question?";
  }

  res.json({ reply });
});

// Start the server
app.listen(PORT, () => {
  console.log(`MacroAI server is running on port ${PORT}`);
});
