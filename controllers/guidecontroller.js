
const Guide = require("../models/Guide"); 

// create a new guide 
async function createGuide (req, res)  {
  try {
    const { websiteId, title, content } = req.body;

    if (!websiteId || !title || !content) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newGuide = new Guide({ websiteId, title, content });
    await newGuide.save();
    
    res.status(201).json(newGuide);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

// Get all guides for a website
async function getAllGuides (req, res)  {
  try {
    const guides = await Guide.find({ websiteId: req.params.websiteId });
    res.json(guides);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

// Update a guide (Protected Route)
async function updateGuide (req, res) {
  try {
    const { title, content } = req.body;
    const updatedGuide = await Guide.findByIdAndUpdate(
      req.params.guideId,
      { title, content },
      { new: true }
    );

    if (!updatedGuide) {
      return res.status(404).json({ msg: "Guide not found" });
    }

    res.json(updatedGuide);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

//  Delete a guide (Protected Route)
 async function deleteGuide (req, res)  {
  try {
    const deletedGuide = await Guide.findByIdAndDelete(req.params.guideId);

    if (!deletedGuide) {
      return res.status(404).json({ msg: "Guide not found" });
    }

    res.json({ msg: "Guide deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

module.exports={
    createGuide,
    getAllGuides,
    updateGuide,
    deleteGuide
}
