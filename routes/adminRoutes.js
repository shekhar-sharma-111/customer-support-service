const express = require("express");
const { adminlogin } = require("../controllers/admincontrollers");
const router = express.Router();

router.post("/login",adminlogin);

module.exports = router;
