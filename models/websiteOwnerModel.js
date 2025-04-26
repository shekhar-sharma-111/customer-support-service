const mongoose = require("mongoose");

const websiteOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  websites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Website", // Reference to the websites they own
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WebsiteOwner", websiteOwnerSchema);
