# 📧 Barakah Studios - Contact Form Setup

Your landing page now has a fully functional contact form! Here's how to get it working:

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email (Gmail)

The contact form uses Gmail to send emails. Follow these steps:

#### Step 1: Enable 2-Factor Authentication
- Go to [myaccount.google.com](https://myaccount.google.com)
- Click "Security" on the left sidebar
- Enable "2-Step Verification" (if not already enabled)

#### Step 2: Create App Password
- Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Select "Mail" and "Windows Computer" (or your OS)
- Google will generate a **16-character password**
- Copy this password (without spaces)

#### Step 3: Configure .env File
- Open `.env` in the project folder
- Replace `your-gmail@gmail.com` with your Gmail address
- Replace `your-16-char-app-password` with the password from Step 2
- (Optional) Set `ADMIN_EMAIL` if you want to receive emails at a different address

**Example .env:**
```
EMAIL_USER=john@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
ADMIN_EMAIL=john@gmail.com
PORT=3000
```

### 3. Start the Server
```bash
npm start
```

The server will run on **http://localhost:3000**

### 4. Test It
- Open http://localhost:3000 in your browser
- Enter your email in the contact form
- Click "Send"
- Check your email for confirmation!

---

## 📨 What Happens When Someone Submits?

1. **User submits email** → Their email is sent to your admin email
2. **You receive an email** with the contact details
3. **They receive a confirmation email** acknowledging we got their message

---

## 🔧 For Development (Auto-Reload)

Use `nodemon` to automatically restart on file changes:
```bash
npm run dev
```

---

## 📝 Customization

### Change Email Template
Edit `server.js` - look for the `transporter.sendMail()` sections to modify:
- Subject lines
- HTML content
- Email layout

### Add Form Fields
1. Update HTML form in `barakah-studios.html` with new inputs
2. Update the form data being sent in the JavaScript `fetch` call
3. Update `server.js` to handle new fields

---

## 🚨 Troubleshooting

**"Failed to send email"**
- Check your .env credentials
- Make sure 2FA is enabled on Gmail
- Verify the App Password was copied correctly

**"Cannot find module 'express'"**
- Run `npm install` again
- Make sure you're in the project directory

**"Port 3000 is already in use"**
- Change `PORT=3000` to another number in .env (e.g., 3001)

---

## 🌐 Deployment (Heroku, Vercel, etc.)

When deploying, set these environment variables in your hosting platform's dashboard:
- `EMAIL_USER` = your-gmail@gmail.com
- `EMAIL_PASS` = your-app-password

Never commit `.env` to git!

---

## 📦 Alternative Email Services

Want to use a different email service? You can easily switch to:
- **SendGrid** - Great for high volume
- **Mailgun** - Good for developers
- **Custom SMTP** - Your own server

Contact support for integration help!

---

## ✨ You're all set! Happy emailing! 🎉
