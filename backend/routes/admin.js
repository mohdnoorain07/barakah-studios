const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error loading leads"
    });
  }
});

module.exports = router;