const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const dotenvResult = require('dotenv').config();
if (dotenvResult.error) {
  console.warn('No .env file found in root. Set EMAIL_USER and EMAIL_PASS in environment or create a root .env file.');
}

const requiredEmailVars = ['EMAIL_USER', 'EMAIL_PASS'];
const missingEmailVars = requiredEmailVars.filter((key) => !process.env[key]);
if (missingEmailVars.length > 0) {
  console.warn(`Missing required email env vars: ${missingEmailVars.join(', ')}`);
}

const hasEmailConfig = missingEmailVars.length === 0;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Email configuration
let transporter = null;
if (hasEmailConfig) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('Nodemailer transporter verification failed:', error);
    } else {
      console.log('✓ Email transporter verified');
    }
  });
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'barakah-studios.html'));
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { email, name = 'Guest', subject = 'New Contact Form Submission' } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email required' });
  }

  try {
    if (!transporter) {
      return res.status(500).json({
        success: false,
        message: 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS.'
      });
    }

    // Email to admin (you)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Contact Submission from Barakah Studios</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${subject}</p>
        <hr>
        <p>Reply to them at: ${email}</p>
      `
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We Received Your Message - Barakah Studios',
      html: `
        <h2>Thank You!</h2>
        <p>Hi ${name},</p>
        <p>We've received your email and will get back to you within 24 hours.</p>
        <p>Our team at Barakah Studios is excited to discuss your project!</p>
        <hr>
        <p style="color: #999; font-size: 12px;">Best regards,<br>Barakah Studios Team</p>
      `
    });

    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Barakah Studios server running on http://localhost:${PORT}`);
  console.log(`✓ Make sure your .env file is configured with EMAIL_USER and EMAIL_PASS`);
});
