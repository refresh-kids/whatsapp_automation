# Setup Validation Checklist

Use this checklist to ensure your WhatsApp Automation system is properly configured before running.

---

## ✅ Prerequisites

### System Requirements
- [ ] Node.js v18 or higher installed
  ```bash
  node --version
  # Should show v18.x.x or higher
  ```
- [ ] npm or yarn installed
  ```bash
  npm --version
  ```
- [ ] Git installed (optional, for version control)

---

## ✅ Project Setup

### Installation
- [ ] Root dependencies installed
  ```bash
  npm install
  ```
- [ ] Backend dependencies installed
  ```bash
  cd backend && npm install
  ```
- [ ] Frontend dependencies installed
  ```bash
  cd frontend && npm install
  ```

---

## ✅ Google Sheets Setup

### Google Cloud Project
- [ ] Google Cloud project created
- [ ] Google Sheets API enabled in project
- [ ] Service account created
- [ ] Service account JSON key downloaded
- [ ] Service account email copied (format: xxx@xxx.iam.gserviceaccount.com)

### Google Sheet
- [ ] Google Sheet created with correct format:
  - Column A: teacher_name
  - Column B: student_name
  - Column C: phone_number
  - Column D: message
  - Column E: meeting_date
  - Column F: meeting_time
  - Column G: status
  - Column H: sent_at

- [ ] Google Sheet shared with service account email
- [ ] Service account has "Editor" permissions
- [ ] Sheet ID copied from URL
- [ ] Sample data added to test

---

## ✅ WhatsApp Cloud API Setup

### Meta Developer Account
- [ ] Meta for Developers account created
- [ ] App created in Meta dashboard
- [ ] WhatsApp product added to app

### WhatsApp Configuration
- [ ] Business phone number verified
- [ ] Phone Number ID obtained
- [ ] Business Account ID obtained
- [ ] Access token generated (permanent token recommended)
- [ ] Test number added and verified (for sandbox testing)

### Message Templates (Production Only)
- [ ] Message templates created in Meta dashboard
- [ ] Templates approved by Meta
- [ ] Template names noted for use in code

---

## ✅ Environment Configuration

### Backend .env File
- [ ] `.env` file created in `backend/` directory
- [ ] All required variables set:

```env
# Server
PORT=5000 ✓
NODE_ENV=development ✓

# Authentication
ADMIN_EMAIL=your_email ✓
ADMIN_PASSWORD=your_password ✓
JWT_SECRET=random_32+_char_string ✓

# Google Sheets
GOOGLE_SHEETS_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com ✓
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN...-----" ✓
GOOGLE_SHEET_ID=your_sheet_id ✓

# WhatsApp
WHATSAPP_API_TOKEN=your_token ✓
WHATSAPP_PHONE_NUMBER_ID=your_phone_id ✓
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id ✓

# Scheduler
SYNC_INTERVAL_MINUTES=5 ✓
CHECK_INTERVAL_MINUTES=1 ✓
```

### Validation Tests

#### Test 1: Google Sheets Connection
```bash
# Start backend
cd backend
npm run dev

# Should see in logs:
# ✅ Google Sheets API initialized successfully
```
- [ ] Backend starts without errors
- [ ] Google Sheets initialization successful
- [ ] No authentication errors

#### Test 2: Backend API
```bash
# In another terminal, test health endpoint:
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Server is running",...}
```
- [ ] Health endpoint responds
- [ ] Returns success status
- [ ] No connection errors

#### Test 3: Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL","password":"YOUR_PASSWORD"}'

# Should return:
# {"success":true,"data":{"token":"..."}}
```
- [ ] Login endpoint works
- [ ] Returns JWT token
- [ ] Credentials are correct

#### Test 4: WhatsApp API Connection
```bash
curl -X GET "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return phone number details
```
- [ ] WhatsApp API responds
- [ ] Token is valid
- [ ] Phone number ID is correct

---

## ✅ Frontend Setup

### Configuration
- [ ] Frontend dependencies installed
- [ ] No build errors when running `npm run dev`
- [ ] Can access http://localhost:3000

### UI Tests
- [ ] Login page loads
- [ ] Can login with admin credentials
- [ ] Dashboard loads after login
- [ ] Navigation menu works
- [ ] Can access Messages page
- [ ] Can access Logs page

---

## ✅ Integration Tests

### Data Flow Test
1. [ ] Click "Sync Sheet" on dashboard
2. [ ] Statistics update (total messages count)
3. [ ] Messages appear in Messages page
4. [ ] Filter buttons work (All/Pending/Sent/Failed)
5. [ ] Refresh button works

### Scheduler Test
1. [ ] Backend shows "Scheduler started" in logs
2. [ ] Dashboard shows scheduler status as "Running"
3. [ ] Last check timestamp updates every minute

### Message Sending Test (Optional)
1. [ ] Add test message to Google Sheet:
   - Meeting date: Today
   - Meeting time: Current time + 20 minutes
   - Status: Pending
2. [ ] Wait 15 minutes (trigger time)
3. [ ] Check Logs page for send attempt
4. [ ] Verify status updated in Google Sheet

---

## ✅ Security Checklist

### Development
- [ ] `.env` file is in `.gitignore`
- [ ] No credentials committed to git
- [ ] Admin password is reasonably strong
- [ ] JWT secret is random and long (32+ characters)

### Production (when deploying)
- [ ] Change admin password to strong password
- [ ] Generate new random JWT secret
- [ ] Use production API credentials
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set NODE_ENV=production

---

## ✅ Common Issues Verification

### Issue Prevention
- [ ] Port 5000 is available (or changed in .env)
- [ ] Port 3000 is available (or changed in vite.config.js)
- [ ] Firewall not blocking localhost connections
- [ ] Antivirus not blocking Node.js
- [ ] Internet connection stable
- [ ] Node.js version compatible (18+)

### Google Sheets
- [ ] Private key has proper formatting with \n
- [ ] Private key wrapped in double quotes
- [ ] Sheet ID is correct (from URL)
- [ ] Service account has Editor access
- [ ] Sheet has all 8 columns in correct order

### WhatsApp
- [ ] Access token is not expired
- [ ] Phone number format is correct (no + sign)
- [ ] Test phone numbers are verified
- [ ] Message templates approved (for production)

---

## ✅ Performance Optimization

### Configuration
- [ ] Sync interval appropriate for your use case (5 minutes default)
- [ ] Check interval appropriate (1 minute default)
- [ ] Rate limiting configured (100 requests per 15 min default)
- [ ] Sheet size reasonable (<1000 rows)

---

## ✅ Documentation Review

### Read These Docs
- [ ] README.md - Overall project documentation
- [ ] QUICKSTART.md - Quick setup guide
- [ ] GOOGLE_SHEET_SCHEMA.md - Sheet format details
- [ ] API_DOCUMENTATION.md - API reference
- [ ] TROUBLESHOOTING.md - Common issues and solutions

---

## ✅ Final Verification

### Smoke Test
Run this complete test sequence:

1. [ ] Start backend: `cd backend && npm run dev`
2. [ ] Start frontend: `cd frontend && npm run dev`
3. [ ] Open http://localhost:3000
4. [ ] Login with admin credentials
5. [ ] Dashboard loads with statistics
6. [ ] Click "Sync Sheet"
7. [ ] Go to Messages page
8. [ ] See messages from Google Sheet
9. [ ] Go to Logs page
10. [ ] See "No logs available" (normal if no messages sent)
11. [ ] Backend shows no errors in terminal
12. [ ] Frontend shows no errors in browser console (F12)

### Success Criteria
If all steps above work:
✅ **System is ready to use!**

If any step fails:
❌ **Review TROUBLESHOOTING.md**

---

## 📋 Quick Reference

### Start Commands
```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Both together (from root)
npm run dev
```

### Stop Commands
```bash
# Press Ctrl + C in terminal
```

### Check Status
```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend
# Open http://localhost:3000 in browser
```

---

## 🆘 Getting Help

If setup fails:
1. Check TROUBLESHOOTING.md
2. Review error messages carefully
3. Verify all environment variables
4. Check service permissions
5. Test each component individually

---

## ✅ Production Readiness Checklist

Before deploying to production:
- [ ] All tests passing
- [ ] Security hardened (strong passwords, etc.)
- [ ] HTTPS configured
- [ ] CORS configured for production domain
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Error tracking enabled
- [ ] Performance tested
- [ ] Documentation updated
- [ ] Deployment guide followed

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment.

---

**Congratulations! 🎉**

If you've checked all items above, your WhatsApp Automation system is properly configured and ready to use!

**Last Updated:** December 2025
