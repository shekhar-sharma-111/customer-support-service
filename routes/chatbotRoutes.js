const express = require("express");
const { processUserMessages, retrieveChatHistory, setChatbotInstructions } = require("../controllers/chatbotcontroller.js");
const router = express.Router();

router.post("/message",processUserMessages);
router.get("/history/:sessionId", retrieveChatHistory);
router.post("/setup",setChatbotInstructions);

module.exports = router;
