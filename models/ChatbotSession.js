const mongoose = require("mongoose");

const ChatbotSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: "Website", required: true },
    messages: [
        {
            sender: { type: String, enum: ["user", "bot"], required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatbotSession", ChatbotSessionSchema);
