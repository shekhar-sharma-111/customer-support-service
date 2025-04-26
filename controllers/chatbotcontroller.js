
const ChatbotSession = require("../models/ChatbotSession.js");
const ChatbotInstructions = require("../models/ChatbotInstructions");

 async function processUserMessages(req, res)  {
    const { sessionId, websiteId, message } = req.body;

    // Retrieve chatbot instructions specific to the website
    const instructions = await ChatbotInstructions.findOne({ websiteId });
    const botReply = instructions
        ? `Based on website settings: ${instructions.instructions}`
        : "Default chatbot response.";

    // Save chat history
    await ChatbotSession.findOneAndUpdate(
        { sessionId },
        { $push: { messages: { sender: "user", text: message } }, websiteId },
        { upsert: true, new: true }
    );
    await ChatbotSession.findOneAndUpdate(
        { sessionId },
        { $push: { messages: { sender: "bot", text: botReply } } },
        { upsert: true, new: true }
    );

    res.json({ reply: botReply });
}

 async function retrieveChatHistory(req, res)  {
    const session = await ChatbotSession.findOne({ sessionId });
    res.json(session ? session.messages : []);
}

 async function setChatbotInstructions(req, res)  {
    const { websiteId, instructions } = req.body;

    await ChatbotInstructions.findOneAndUpdate(
        { websiteId },
        { instructions },
        { upsert: true, new: true }
    );

    res.json({ message: "Chatbot instructions updated." });
}

module.exports ={
    processUserMessages,
    retrieveChatHistory,
    setChatbotInstructions
}
