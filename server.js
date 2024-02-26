const PORT = 8000;

// Import the necessary modules
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();

// Create an instance of an Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create an instance of the GoogleGenerativeAI class
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define a route handler for GET requests made to /chat
app.post("/chat", async function (req, res) {
  const { history, message } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history,
  });
  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = response.text();

  res.send(text);
});

// Have the app listen on port 8000
app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`);
});
