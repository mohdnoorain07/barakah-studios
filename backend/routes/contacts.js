const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check duplicate
    let lead = await Lead.findOne({ email });

    if (!lead) {
      lead = await Lead.create({ email });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Try sending email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "🚀 New Barakah Studios Lead",
        html: `
          <h2>New Visitor Lead</h2>

          <p><strong>Email:</strong> ${lead.email}</p>

          <p><strong>Submitted At:</strong> ${new Date(
            lead.createdAt
          ).toLocaleString("en-IN")}</p>
        `
      });

      console.log("✅ Email sent successfully");

    } catch (mailError) {
      console.error("❌ Email Error:", mailError.message);
    }

    // Always return success because lead is already saved
    return res.status(200).json({
      success: true,
      message: "Lead saved successfully"
    });

  } catch (error) {
    console.error("❌ Server Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

module.exports = router;