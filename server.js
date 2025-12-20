// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Replace with your actual Deepseek API key
const DEEPSEEK_API_KEY = "YOUR_DEEPSEEK_API_KEY";

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.json({ reply: "Please ask a valid question." });
  }

  try {
    // Call Deepseek API
    const response = await axios.post(
      "https://api.deepseek.ai/v1/query", // Replace with the actual Deepseek endpoint
      { query: message },
      {
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Assuming Deepseek returns JSON like: { answer: "..." }
    let reply = response.data.answer || "I couldn't find an answer to that question.";

    res.json({ reply });

  } catch (err) {
    console.error(err.message, err.response?.data);
    res.json({
      reply: "I encountered an error while fetching information from Deepseek. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MacroAI running on port ${PORT}`);
});
