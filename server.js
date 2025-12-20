// server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so frontend or Postman can call the API
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to MacroAI! Your professional AI assistant is running.");
});

// Chat endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  const lowerMessage = message.toLowerCase();
  let reply;

  if (lowerMessage.includes("elon musk")) {
    reply =
      "Elon Musk is a technology entrepreneur, engineer, and investor. He is the CEO of SpaceX and Tesla, and is known for his work in space exploration, electric vehicles, and renewable energy.";
  } else if (lowerMessage.includes("who are you")) {
    reply =
      "I am MacroAI, your professional AI assistant designed to provide accurate and clear information.";
  } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    reply = "Hello! How can I assist you today?";
  } else {
    reply =
      "I’m here to help! Could you please provide more details or ask a specific question?";
  }

  res.json({ reply });
});

// Start server
app.listen(PORT, () => {
  console.log(`MacroAI server is running on port ${PORT}`);
});
