const express = require("express");
const router = express.Router();
const Website = require("../models/Website");
const authMiddleware = require("../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");
const { addNewWebsite, updateWebsiteServices, deleteWebsite, createWebsite, getAllWebsites, updateChatbotInstructionWebsiteSpecific, getWebitesLoggedinOwner } = require("../controllers/websitecontroller");


// ✅ Add a new website (Admin Only)
router.post("/",addNewWebsite);
// ✅ Get all websites (Admin)
router.get("/",getAllWebsites);
// ✅ Update website services (Admin)
router.put("/:websiteId/services",updateWebsiteServices);
// ✅ Delete a website (Admin)
router.delete("/:websiteId",deleteWebsite);
// 🔹 Create a Website (Authenticated Route)
router.post(
  "/create",
  authMiddleware,
  [
    check("name", "Website name is required").not().isEmpty(),
    check("domain", "Website domain is required").not().isEmpty()
  ],createWebsite
);
router.get("/my-websites", authMiddleware,getWebitesLoggedinOwner);
router.put("/:websiteId/chatbot-instructions", authMiddleware,updateChatbotInstructionWebsiteSpecific);

module.exports = router;
