const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const WebsiteOwner = require("../models/websiteOwnerModel");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Register Website Owner
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if the owner already exists
      let owner = await WebsiteOwner.findOne({ email });
      if (owner) {
        return res.status(400).json({ msg: "Owner already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new owner
      owner = new WebsiteOwner({
        name,
        email,
        password: hashedPassword,
      });

      await owner.save();

      // Generate JWT Token
      const token = jwt.sign({ ownerId: owner.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({ token, owner });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// ✅ Login Owner
router.post(
  "/login",
  [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find owner
      let owner = await WebsiteOwner.findOne({ email });
      if (!owner) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, owner.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Generate JWT Token
      const token = jwt.sign({ ownerId: owner.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({ token, owner });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// ✅ Get Logged-in Owner Details (Protected)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const owner = await WebsiteOwner.findById(req.user.id).select("-password");
    if (!owner) {
      return res.status(404).json({ msg: "Owner not found" });
    }
    res.json(owner);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
