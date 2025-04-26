const mongoose = require("mongoose");

const ChatbotInstructionsSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: "Website", required: true },
    instructions: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatbotInstructions", ChatbotInstructionsSchema);
