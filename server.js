import express from "express";

const app = express();
app.use(express.json());

// --------------------
// Root check (important for Render)
// --------------------
app.get("/", (req, res) => {
  res.send("✅ MacroAI server is running");
});

// --------------------
// Ask endpoint
// --------------------
app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question || question.trim() === "") {
      return res.json({ answer: "Please ask a valid question." });
    }

    // Wikipedia search API (FREE)
    const searchUrl =
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
      encodeURIComponent(question);

    const response = await fetch(searchUrl, {
      headers: { "User-Agent": "MacroAI/1.0" }
    });

    if (!response.ok) {
      return res.json({
        answer: "I couldn't find a reliable answer yet. Try rephrasing the question."
      });
    }

    const data = await response.json();

    if (data.extract) {
      return res.json({
        answer: data.extract
      });
    } else {
      return res.json({
        answer: "I couldn't find a reliable answer yet. Try rephrasing the question."
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.json({
      answer: "Error reaching the internet. Please try again."
    });
  }
});

// --------------------
// REQUIRED for Render
// --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 MacroAI server running on port", PORT);
});
