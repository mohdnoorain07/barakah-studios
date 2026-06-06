const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Save in MongoDB
const existingLead = await Lead.findOne({ email });

if (existingLead) {
  return res.status(400).json({
    success: false,
    message: "Email already registered"
  });
}

const lead = await Lead.create({ email });    // Gmail Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send Email
 await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: "🚀 New Barakah Studios Lead",
  html: `
    <h2>New Visitor Lead</h2>

    <p>
      <strong>Email:</strong>
      ${lead.email}
    </p>

    <p>
      <strong>Submitted At:</strong>
      ${new Date(lead.createdAt).toLocaleString("en-IN")}
    </p>
  `
});

    res.json({
      success: true,
      message: "Lead Saved & Email Sent"
    });

  } catch (error) {
    console.error(error);


  
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

module.exports = router;