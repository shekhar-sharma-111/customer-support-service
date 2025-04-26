// const mongoose = require("mongoose");

// const GuideSchema = new mongoose.Schema({
//   websiteId: { type: mongoose.Schema.Types.ObjectId, ref: "Website", required: true },
//   title: { type: String, required: true },
//   content: { type: String, required: true }
// }, { timestamps: true });

// module.exports = mongoose.model("Guide", GuideSchema);
const mongoose = require("mongoose");

const GuideSchema = new mongoose.Schema({
  websiteId: { type: mongoose.Schema.Types.ObjectId, ref: "Website", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Guide", GuideSchema);
