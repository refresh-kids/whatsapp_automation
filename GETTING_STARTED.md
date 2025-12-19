# 🚀 Getting Started with WhatsApp Automation

Welcome! This guide will help you get your WhatsApp Automation system up and running.

---

## 📚 What to Read First

### 1. Start Here (You are here! 👈)
Read this file to understand the basics and choose your path.

### 2. Choose Your Path

**Path A: Quick Start (Recommended for testing)**
- **Time:** 10-15 minutes
- **Goal:** Get the system running quickly
- **Read:** [QUICKSTART.md](QUICKSTART.md)

**Path B: Complete Setup (Recommended for production)**
- **Time:** 30-60 minutes
- **Goal:** Full production setup with all features
- **Read:** [README.md](README.md)

**Path C: Understanding the System**
- **Time:** 20-30 minutes
- **Goal:** Learn how everything works
- **Read:** [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) + [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🎯 What This System Does

**In Simple Terms:**

This application automatically sends WhatsApp messages to students **15 minutes before** their scheduled meetings with teachers.

**How it Works:**
1. You maintain a Google Sheet with meeting information
2. The system checks the sheet every minute
3. When a meeting is 15 minutes away, it sends a WhatsApp reminder
4. You can monitor everything from a web dashboard

---

## 📋 What You Need

### Required (Must Have)
- ✅ A computer with Node.js installed
- ✅ Google account (for Google Sheets)
- ✅ Meta (Facebook) developer account (for WhatsApp)
- ✅ 30-60 minutes to set up

### Optional (Nice to Have)
- ⭐ Basic knowledge of React and Node.js
- ⭐ Understanding of REST APIs
- ⭐ Command line familiarity

---

## 🗺️ File Navigator

### 📚 Documentation Files (11)

| File | Purpose | When to Read |
|------|---------|--------------|
| **GETTING_STARTED.md** | You are here! | First |
| **QUICKSTART.md** | Fast 5-min setup | Want quick testing |
| **README.md** | Complete documentation | Want full details |
| **PROJECT_SUMMARY.md** | Technical overview | Want to understand |
| **ARCHITECTURE.md** | System diagrams | Want visual overview |
| **API_DOCUMENTATION.md** | API reference | Building integrations |
| **GOOGLE_SHEET_SCHEMA.md** | Sheet format | Setting up sheet |
| **SETUP_CHECKLIST.md** | Validation checklist | Verifying setup |
| **TROUBLESHOOTING.md** | Problem solutions | Having issues |
| **DEPLOYMENT.md** | Production deploy | Going live |
| **CHANGELOG.md** | Version history | Tracking changes |

### 💻 Code Files

**Backend (13 files)**
```
backend/
├── server.js                    # Start here to understand backend
├── config/config.js             # Configuration management
├── services/                    # Core business logic
│   ├── googleSheetsService.js   # Google Sheets integration
│   ├── whatsappService.js       # WhatsApp messaging
│   └── schedulerService.js      # Automatic scheduling
├── controllers/                 # Request handlers
├── routes/                      # API endpoints
└── middleware/                  # Auth & security
```

**Frontend (13 files)**
```
frontend/
├── src/main.jsx                 # Start here to understand frontend
├── src/pages/                   # UI pages
│   ├── Login.jsx                # Login page
│   ├── Dashboard.jsx            # Main dashboard
│   ├── Messages.jsx             # Messages table
│   └── Logs.jsx                 # Activity logs
├── src/components/              # Reusable components
└── src/context/                 # State management
```

---

## 🚀 Quick Decision Tree

**Choose your starting point:**

```
Do you want to test quickly?
├─ Yes → Follow QUICKSTART.md (15 minutes)
└─ No
    └─ Do you have API credentials ready?
        ├─ Yes → Follow README.md (full setup)
        └─ No → Start with "Prerequisites Setup" below
```

---

## 📝 Prerequisites Setup

### Step 1: Install Node.js

**Check if installed:**
```bash
node --version
# Should show v18.x.x or higher
```

**Not installed?**
- Download from [nodejs.org](https://nodejs.org/)
- Install version 18 or higher
- Restart your terminal

---

### Step 2: Setup Google Sheets API

**Time Required:** 15 minutes

**What You'll Get:**
- Service account email
- Private key JSON file
- Enabled Google Sheets API

**Detailed Steps:**
See [README.md](README.md) Section: "3. Google Sheets API Setup"

**Quick Summary:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable Google Sheets API
4. Create service account
5. Download JSON key file
6. Save credentials

---

### Step 3: Setup WhatsApp Cloud API

**Time Required:** 20 minutes

**What You'll Get:**
- Access token
- Phone number ID
- Business account ID

**Detailed Steps:**
See [README.md](README.md) Section: "4. WhatsApp Cloud API Setup"

**Quick Summary:**
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an app
3. Add WhatsApp product
4. Get Phone Number ID
5. Generate access token
6. Verify phone number

---

### Step 4: Prepare Google Sheet

**Time Required:** 5 minutes

**What You Need:**
A Google Sheet with these exact columns:

```
A: teacher_name
B: student_name
C: phone_number (format: 14155551234)
D: message (with placeholders like {{student_name}})
E: meeting_date (format: 2025-12-20)
F: meeting_time (format: 14:30)
G: status (Pending/Sent/Failed)
H: sent_at (auto-filled)
```

**Detailed Format:**
See [GOOGLE_SHEET_SCHEMA.md](GOOGLE_SHEET_SCHEMA.md)

**Sample Data:**
See [sample_google_sheet.csv](sample_google_sheet.csv)

---

## 🎬 Installation Steps

### Step 1: Get the Code

```bash
# If you have git:
git clone <repository-url>
cd whatsapp_automation

# If you downloaded as ZIP:
# Extract the ZIP file
cd whatsapp_automation
```

---

### Step 2: Install Dependencies

```bash
# Install everything at once (recommended):
npm run install-all

# Or install separately:
npm install
cd backend && npm install
cd ../frontend && npm install
```

**This installs:**
- 10+ backend packages
- 8+ frontend packages
- Build tools

**Takes:** 2-3 minutes

---

### Step 3: Configure Environment

**Create the .env file:**

```bash
cd backend
cp ../.env.example .env
```

**Edit backend/.env with your credentials:**

Use your favorite text editor:
- Windows: `notepad .env`
- Mac/Linux: `nano .env` or `vim .env`

**Required variables:**
```env
# Admin login
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password_here

# Security
JWT_SECRET=your_random_32_character_string_here

# Google Sheets (from Step 2)
GOOGLE_SHEETS_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_sheet_id_from_url

# WhatsApp (from Step 3)
WHATSAPP_API_TOKEN=your_token_here
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789
```

**Pro Tip:** Use [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) to verify everything is correct!

---

### Step 4: Run the Application

**Option 1: Run Everything Together (Recommended)**
```bash
# From root directory:
npm run dev
```

**Option 2: Run Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**You should see:**
```
✅ Google Sheets API initialized successfully
✅ Scheduler started
🚀 Server running on: http://localhost:5000
🌐 Frontend running on: http://localhost:3000
```

---

## 🎉 First Use

### Step 1: Access the Application

Open your browser:
```
http://localhost:3000
```

### Step 2: Login

Use credentials from your `.env` file:
- **Email:** admin@example.com (or what you set)
- **Password:** your_secure_password (or what you set)

### Step 3: Explore the Dashboard

You should see:
- Statistics cards (Total, Pending, Sent, Failed)
- Scheduler status
- Action buttons

### Step 4: Sync Your Data

Click the **"Sync Sheet"** button to load data from Google Sheets.

### Step 5: View Messages

Navigate to **Messages** page to see all your scheduled messages.

### Step 6: Monitor Logs

Navigate to **Logs** page to see message send history.

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running without errors (check terminal)
- [ ] Frontend accessible at http://localhost:3000
- [ ] Can login with admin credentials
- [ ] Dashboard shows statistics
- [ ] Can click "Sync Sheet" successfully
- [ ] Messages appear in Messages page
- [ ] Scheduler status shows "Running"
- [ ] No red errors in browser console (F12)

**All checked?** 🎉 **You're ready to use the system!**

**Some unchecked?** 😟 **See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

---

## 📱 Testing Message Sending

### Safe Test

1. Add a test message to your Google Sheet:
   ```
   teacher_name: Test Teacher
   student_name: Test Student
   phone_number: [Your verified test number]
   message: Hi {{student_name}}, test reminder!
   meeting_date: [Today's date]
   meeting_time: [Current time + 20 minutes]
   status: Pending
   ```

2. Wait 15 minutes (system sends 15 min before meeting)

3. Check the Logs page for the send attempt

4. Verify the message was received

---

## 🔧 Common First-Time Issues

### Issue: Backend won't start
**Solution:** Check if port 5000 is available
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

### Issue: Can't login
**Solution:** Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`

### Issue: No messages showing
**Solution:**
1. Click "Sync Sheet"
2. Verify Google Sheet is shared with service account
3. Check backend terminal for errors

### Issue: Messages not sending
**Solution:**
1. Verify WhatsApp API token is valid
2. Check phone number format (no + symbol)
3. Ensure meeting time is in the future
4. Check Logs page for error details

**More issues?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📖 Next Steps

### 1. Understand the System
- Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- Review [ARCHITECTURE.md](ARCHITECTURE.md)
- Explore the code with comments

### 2. Customize
- Modify message templates
- Adjust reminder timing
- Customize UI colors
- Add your branding

### 3. Deploy to Production
- Follow [DEPLOYMENT.md](DEPLOYMENT.md)
- Choose hosting platform
- Configure production settings
- Set up monitoring

### 4. Maintain
- Monitor the dashboard regularly
- Check logs for failures
- Update dependencies monthly
- Backup your Google Sheet

---

## 🆘 Getting Help

### Self-Help Resources
1. **TROUBLESHOOTING.md** - Solutions to common issues
2. **API_DOCUMENTATION.md** - API reference
3. **README.md** - Complete documentation
4. **Code Comments** - Detailed explanations in code

### Debug Tools
- Backend logs (terminal output)
- Browser console (F12)
- Logs page (in dashboard)
- API health check: `http://localhost:5000/api/health`

### Quick Tests
```bash
# Test backend:
curl http://localhost:5000/api/health

# Test login:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

---

## 🎓 Learning Path

### Beginner
1. ✅ Setup and run the system
2. ✅ Add test messages
3. ✅ Use the dashboard
4. ✅ Monitor logs

### Intermediate
1. ✅ Understand architecture
2. ✅ Customize messages
3. ✅ Adjust scheduler settings
4. ✅ Deploy to production

### Advanced
1. ✅ Extend functionality
2. ✅ Add new features
3. ✅ Integrate with other systems
4. ✅ Scale for high volume

---

## 🎁 What's Included

### Complete System
- ✅ Backend REST API
- ✅ Frontend dashboard
- ✅ Google Sheets integration
- ✅ WhatsApp messaging
- ✅ Automatic scheduling

### Documentation
- ✅ 11 comprehensive guides
- ✅ API reference
- ✅ Troubleshooting help
- ✅ Deployment guide

### Code Quality
- ✅ Clean, modular code
- ✅ Comprehensive comments
- ✅ Best practices
- ✅ Production-ready

---

## 🏁 Ready to Start?

Choose your path:

**1. Quick Test (15 minutes)**
→ Follow [QUICKSTART.md](QUICKSTART.md)

**2. Full Setup (60 minutes)**
→ Follow [README.md](README.md)

**3. Understand First**
→ Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## 📞 Quick Reference

### Start Application
```bash
npm run dev
```

### Stop Application
```
Press Ctrl + C in terminal
```

### Access Application
```
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

### Check Status
```bash
curl http://localhost:5000/api/health
```

---

## 🎉 Success!

If you've made it this far, you're ready to use WhatsApp Automation!

**Enjoy automating your WhatsApp messages! 🚀**

---

**Questions?** Check the documentation files listed above.

**Issues?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**Ready to deploy?** See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
