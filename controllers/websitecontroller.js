const express = require("express");
const router = express.Router();
const Website = require("../models/Website");
const authMiddleware = require("../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");


// ✅ Add a new website (Admin Only)
 async function addNewWebsite (req, res)  {
  try {
    const { name, domain, ownerEmail, services } = req.body;
    const website = new Website({ name, domain, ownerEmail, services });
    await website.save();
    res.status(201).json(website);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ✅ Get all websites (Admin)
async function getAllWebsites(req, res)  {
  const websites = await Website.find();
  res.json(websites);
}

// ✅ Update website services (Admin)
 async function updateWebsiteServices (req, res)  {
  try {
    const { websiteId } = req.params;
    const { services } = req.body;
    const website = await Website.findByIdAndUpdate(websiteId, { services }, { new: true });
    if (!website) return res.status(404).json({ message: "Website not found" });
    res.json(website);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ✅ Delete a website (Admin)
async function deleteWebsite (req, res)  {
  try {
    await Website.findByIdAndDelete(req.params.websiteId);
    res.json({ message: "Website deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// 🔹 Create a Website (Authenticated Route)

  async function createWebsite(req, res)  {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, domain, services } = req.body;
      const owner = req.user.id; // Get logged-in user's ID

      const newWebsite = new Website({
        owner,
        name,
        domain,
        services
      });

      await newWebsite.save();
      res.status(201).json(newWebsite);
    } catch (err) {
      res.status(500).json({ error: "Server Error" });
    }
  }

// 🔹 Get Websites for Logged-in Owner
 async function getWebitesLoggedinOwner(req, res) {
  try {
    const websites = await Website.find({ owner: req.user.id });
    res.json(websites);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
}

// ✅ Update chatbot instructions for a specific website
async function updateChatbotInstructionWebsiteSpecific(req, res)  {
  try {
    const { websiteId } = req.params;
    const { chatbotInstructions } = req.body;

    const website = await Website.findOne({ _id: websiteId, owner: req.user._id });

    if (!website) return res.status(404).json({ msg: "Website not found" });

    website.chatbotInstructions = chatbotInstructions;
    await website.save();

    res.json({ msg: "Chatbot instructions updated successfully", chatbotInstructions });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
}

module.exports = {
    addNewWebsite,
    updateWebsiteServices,
    getAllWebsites,
    deleteWebsite,
    createWebsite,
    getWebitesLoggedinOwner,
    updateChatbotInstructionWebsiteSpecific,

};
