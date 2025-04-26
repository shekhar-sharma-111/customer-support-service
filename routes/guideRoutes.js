const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Guide = require("../models/Guide");
const { createGuide, getAllGuides, updateGuide, deleteGuide } = require("../controllers/guidecontroller");

router.post("/", authMiddleware,createGuide);
router.get("/:websiteId", getAllGuides);
router.put("/:guideId", authMiddleware,updateGuide);
router.delete("/:guideId", authMiddleware,deleteGuide);

module.exports = router;
