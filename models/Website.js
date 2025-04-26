const mongoose = require("mongoose");

const WebsiteSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link website to owner
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    services: {
        guideSupport: { type: Boolean, default: false },
        chatbot: { type: Boolean, default: false },
        liveChat: { type: Boolean, default: false },
        emailSupport: { type: Boolean, default: false }
    },
    chatbotInstructions: { type: String, default: "Default chatbot behavior" }, // ✅ New field
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Website", WebsiteSchema);
