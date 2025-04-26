require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require('axios');
const { spawn } = require('child_process');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/api/owners", require("./routes/ownerRoutes"));
app.use("/api/websites", require("./routes/websiteRoutes"));
app.use("/api/guides", require("./routes/guideRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.post('/api/chat', async (req, res) => {
  const userPrompt = req.body.prompt;

  const ollama = spawn('ollama', ['run', 'mistral']);
   
  let response = '';
  ollama.stdout.on('data', data => {
    response += data.toString();
  });

  ollama.stdin.write(userPrompt + '\n');
  ollama.stdin.end();

  ollama.on('close', () => {
    res.json({ reply: response.trim() });
  });

  ollama.stderr.on('data', err => {
    console.error('Error:', err.toString());
  });
});

app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  console.log('[INFO] Received prompt:', prompt);

  if (!prompt) {
    console.warn('[WARN] No prompt provided in request');
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('[INFO] Sending prompt to Ollama API...');
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt,
      stream: false,
    });

    console.log('[INFO] Response received from Ollama');
    res.json({ response: response.data.response });
  } catch (error) {
    console.error('[ERROR] Failed to get response from Mistral:', error.message);
    res.status(500).json({ error: 'Failed to get response from Mistral' });
  }
});
app.get("/", (req, res) => {
  res.send("Support Service API is running...");
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
