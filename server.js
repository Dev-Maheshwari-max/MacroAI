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

// ✅ Insert your new Deepseek API key here
const DEEPSEEK_API_KEY = "sk-e5902cde92b441f4a86eb016fc28695d";

// POST endpoint for MacroAI chat
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.json({ reply: "Please ask a valid question." });
  }

  try {
    // ⚠️ Update this endpoint if your key uses a different one
    const endpoint = "https://api.deepseek.ai/v1/query"; 

    // Deepseek request payload
    const payload = { query: message }; // or { question: message } depending on your key

    const response = await axios.post(endpoint, payload, {
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // Use the answer field returned by Deepseek
    const reply = response.data.answer || "I couldn't find an answer to that question.";

    res.json({ reply });

  } catch (err) {
    console.error("Deepseek API error:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }
    res.json({
      reply:
        "I encountered an error while fetching information from Deepseek. Please check your API key and endpoint."
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MacroAI running on port ${PORT}`);
});
