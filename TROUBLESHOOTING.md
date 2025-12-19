# 🐛 Troubleshooting Guide

## Common Issues and Solutions

---

## 🔴 Backend Issues

### Issue 1: Backend Won't Start

**Error:** `Cannot find module 'dotenv'` or similar

**Solution:**
```bash
cd backend
npm install
```

---

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
Port 5000 is already in use. Either:

**Option 1:** Kill the process using port 5000
```powershell
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Option 2:** Change the port in `.env`
```env
PORT=5001
```

---

**Error:** `JWT_SECRET is not defined`

**Solution:**
1. Ensure `.env` file exists in `backend/` directory
2. Add `JWT_SECRET=your_secret_key` to `.env`
3. Restart the backend

---

### Issue 2: Google Sheets Connection Failed

**Error:** `Failed to initialize Google Sheets API`

**Solution:**
1. **Check service account credentials:**
   ```bash
   # Verify these are set in backend/.env
   GOOGLE_SHEETS_CLIENT_EMAIL=...
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=...
   ```

2. **Verify private key format:**
   - Must include quotes
   - Must include `\n` for line breaks
   - Example:
   ```env
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
   ```

3. **Check Google Sheets API is enabled:**
   - Go to Google Cloud Console
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Ensure it's enabled

4. **Verify sheet sharing:**
   - Open your Google Sheet
   - Click "Share"
   - Ensure service account email has "Editor" access
   - Service account email format: `xxx@xxx.iam.gserviceaccount.com`

---

**Error:** `The caller does not have permission`

**Solution:**
The service account doesn't have access to the sheet.
1. Copy the service account email from `.env`
2. Open Google Sheet
3. Click "Share" button
4. Add the service account email
5. Give it "Editor" permissions
6. Click "Send" (uncheck "Notify people")

---

**Error:** `Unable to parse range: Sheet1!A:H`

**Solution:**
1. Ensure your sheet is named "Sheet1" (or update code)
2. Check if the sheet has the correct columns (A through H)
3. Verify the sheet isn't empty

---

### Issue 3: WhatsApp API Issues

**Error:** `Failed to send WhatsApp message`

**Solution:**

**Check 1: Verify API Token**
```bash
# Test API token with curl
curl -X GET "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

If this fails, your token is invalid. Generate a new one from Meta for Developers.

**Check 2: Verify Phone Number ID**
```env
# Ensure this is correct in .env
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

**Check 3: Phone Number Format**
- ❌ Wrong: `+1 (415) 555-1234`
- ❌ Wrong: `+14155551234`
- ✅ Correct: `14155551234`

**Check 4: Message Template Approval**
For production, you need approved message templates. During development, use text messages for testing.

---

**Error:** `Invalid access token`

**Solution:**
1. Access token may have expired
2. Go to Meta for Developers dashboard
3. Generate a new permanent access token
4. Update `WHATSAPP_API_TOKEN` in `.env`
5. Restart backend

---

### Issue 4: Scheduler Not Working

**Error:** Messages not being sent automatically

**Solution:**

**Check 1: Verify Scheduler is Running**
```bash
# Look for this in backend logs:
✅ Scheduler started
```

**Check 2: Check Meeting Time**
Messages are sent 15 minutes BEFORE meeting time.
- Current time must be >= (meeting_datetime - 15 minutes)
- Ensure meeting is in the future

**Check 3: Check Status**
- Status must be "Pending" (case-insensitive)
- If already "Sent" or "Failed", it won't resend

**Check 4: Review Logs**
Check the Logs page in the dashboard for error messages.

---

**Error:** `Scheduler shows as "Stopped"`

**Solution:**
The scheduler may have crashed. Restart the backend:
```bash
cd backend
npm run dev
```

---

## 🔴 Frontend Issues

### Issue 1: Frontend Won't Start

**Error:** `Cannot find module 'react'`

**Solution:**
```bash
cd frontend
npm install
```

---

**Error:** `Port 3000 is already in use`

**Solution:**

**Option 1:** Kill the process
```powershell
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Option 2:** Change port in `vite.config.js`
```javascript
export default defineConfig({
  server: {
    port: 3001, // Changed from 3000
  },
})
```

---

### Issue 2: Can't Login

**Error:** `Invalid credentials`

**Solution:**
1. Check credentials in `backend/.env`:
   ```env
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_password
   ```

2. Use exact credentials from `.env` file

3. If password contains special characters, try wrapping in quotes:
   ```env
   ADMIN_PASSWORD="your_password_with_!@#"
   ```

---

**Error:** `Access token required`

**Solution:**
1. Clear browser localStorage
2. Login again
3. If issue persists, check browser console for errors

---

### Issue 3: Dashboard Shows No Data

**Error:** Dashboard statistics show 0 for everything

**Solution:**

**Check 1: Backend Connection**
Open browser console (F12) and check for errors like:
- `Network Error`
- `Failed to fetch`

If you see these, backend is not running or not accessible.

**Check 2: Click "Sync Sheet"**
The dashboard needs to load data first. Click the "Sync Sheet" button.

**Check 3: Verify Google Sheet**
Ensure your Google Sheet has data and is properly shared with the service account.

---

**Error:** `CORS error in browser console`

**Solution:**
1. Ensure backend is running
2. Check `backend/server.js` has CORS enabled:
   ```javascript
   import cors from 'cors';
   app.use(cors());
   ```

3. If still failing, try:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:3000',
     credentials: true,
   }));
   ```

---

### Issue 4: Messages Page is Empty

**Error:** No messages showing in the table

**Solution:**

**Check 1: Sync Data**
Click the "Refresh" button on the Messages page

**Check 2: Verify Backend**
```bash
# Test the API directly
curl -X GET "http://localhost:5000/api/sheet/messages" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Check 3: Check Google Sheet**
- Ensure sheet has data starting from row 2
- Row 1 should be headers
- Verify column names match exactly

---

### Issue 5: Logs Page Not Showing Logs

**Error:** "No logs available"

**Solution:**
This is normal if no messages have been sent yet.

To test:
1. Add a message with meeting time = current time + 20 minutes
2. Wait for scheduler to process (15 minutes before meeting)
3. Check Logs page after message is sent

---

## 🔴 Data Issues

### Issue 1: Phone Number Invalid

**Error:** `Invalid phone number format`

**Solution:**

**Correct Format:**
```
Country  | Format        | Example
---------|---------------|-------------
USA      | 1XXXXXXXXXX   | 14155551234
UK       | 44XXXXXXXXXX  | 447911123456
India    | 91XXXXXXXXXX  | 919876543210
```

**Rules:**
- Include country code
- No + symbol
- No spaces
- No dashes
- No parentheses
- Only digits

---

### Issue 2: Date/Time Format Error

**Error:** Messages not triggering at correct time

**Solution:**

**Correct Formats:**
- **Date:** `YYYY-MM-DD` (e.g., `2025-12-20`)
- **Time:** `HH:mm` in 24-hour format (e.g., `14:30` for 2:30 PM)

**Common Mistakes:**
- ❌ `12/20/2025` (wrong date format)
- ❌ `2:30 PM` (wrong time format)
- ❌ `14:30:00` (includes seconds)
- ✅ `2025-12-20` (correct date)
- ✅ `14:30` (correct time)

---

### Issue 3: Status Not Updating

**Error:** Status stays "Pending" after message sent

**Solution:**

**Check 1: Service Account Permissions**
Ensure service account has "Editor" access (not just "Viewer")

**Check 2: Sheet Protection**
If sheet is protected, service account must have edit permission

**Check 3: Backend Logs**
Check terminal for errors like:
```
❌ Error updating row X
```

---

### Issue 4: Duplicate Messages

**Error:** Same message sent multiple times

**Solution:**
This shouldn't happen due to status tracking, but if it does:

1. **Check Status Column:**
   - After sending, status should change to "Sent"
   - If it stays "Pending", backend can't update the sheet

2. **Verify Sheet ID:**
   ```env
   # Ensure this matches your actual sheet
   GOOGLE_SHEET_ID=abc123xyz
   ```

3. **Restart Backend:**
   This resets the "last processed row" tracker

---

## 🔴 Performance Issues

### Issue 1: Slow Dashboard Loading

**Solution:**
1. Reduce refresh interval in Dashboard.jsx:
   ```javascript
   // Change from 30000 to 60000 (60 seconds)
   const interval = setInterval(fetchData, 60000);
   ```

2. Optimize Google Sheets:
   - Keep sheet under 1000 rows
   - Archive old messages to another sheet

---

### Issue 2: Backend High CPU Usage

**Solution:**
1. Increase scheduler intervals:
   ```env
   # Change to higher values
   SYNC_INTERVAL_MINUTES=10
   CHECK_INTERVAL_MINUTES=2
   ```

2. Reduce log verbosity:
   ```javascript
   // Comment out excessive console.log statements
   ```

---

## 🔴 Deployment Issues

### Issue 1: Backend Crashes on Heroku

**Solution:**
1. Check Heroku logs:
   ```bash
   heroku logs --tail
   ```

2. Ensure all environment variables are set:
   ```bash
   heroku config
   ```

3. Verify Procfile exists:
   ```
   web: cd backend && npm start
   ```

---

### Issue 2: Frontend 404 on Vercel

**Solution:**
Create `vercel.json` in frontend directory:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 🔴 Testing Issues

### Issue 1: Can't Test WhatsApp in Sandbox

**Solution:**
WhatsApp Cloud API sandbox has limitations:
- Only verified test numbers can receive messages
- Limited message types

**For Testing:**
1. Add your test number in Meta dashboard
2. Verify the number via WhatsApp
3. Use approved test numbers only

---

### Issue 2: Google Sheets API Quota Exceeded

**Error:** `Quota exceeded for quota metric 'Read requests'`

**Solution:**
1. Google Sheets API has quotas:
   - 100 requests per 100 seconds per user
   - 500 requests per 100 seconds per project

2. Reduce sync frequency:
   ```env
   SYNC_INTERVAL_MINUTES=10  # Increase from 5
   ```

3. Request quota increase in Google Cloud Console

---

## 🛠️ Debug Tools

### Enable Debug Logging

**Backend:**
Add to `backend/server.js`:
```javascript
// Enable detailed logging
process.env.DEBUG = '*';
```

**Frontend:**
Open browser console (F12) and check:
- Network tab for API calls
- Console tab for errors
- Application tab for localStorage

---

### Test API Endpoints

Use Postman or curl:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_secure_password"}'
```

**Get Messages:**
```bash
curl -X GET http://localhost:5000/api/sheet/messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📞 Getting Help

If you're still stuck:

1. **Check Documentation:**
   - [README.md](README.md)
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
   - [GOOGLE_SHEET_SCHEMA.md](GOOGLE_SHEET_SCHEMA.md)

2. **Review Logs:**
   - Backend terminal output
   - Browser console (F12)
   - Logs page in dashboard

3. **Verify Configuration:**
   - All environment variables set correctly
   - Google Sheet format matches schema
   - API credentials are valid

4. **Test Components Individually:**
   - Test Google Sheets connection
   - Test WhatsApp API
   - Test scheduler

---

## 🔍 Useful Commands

### Check if Backend is Running
```bash
curl http://localhost:5000/api/health
```

### View Backend Logs (Production)
```bash
# PM2
pm2 logs whatsapp-backend

# Heroku
heroku logs --tail
```

### Clear Browser Cache
```
Press Ctrl + Shift + Delete
Select "Cached images and files"
Clear data
```

### Restart Everything
```bash
# Stop all processes
# Then:
cd backend
npm run dev

# In another terminal:
cd frontend
npm run dev
```

---

## ✅ Quick Checklist

When something goes wrong, verify:

- [ ] Backend is running (check http://localhost:5000/api/health)
- [ ] Frontend is running (check http://localhost:3000)
- [ ] `.env` file exists and has all variables
- [ ] Google Sheets API is enabled
- [ ] Service account has access to sheet
- [ ] Sheet has correct format (8 columns)
- [ ] WhatsApp API credentials are valid
- [ ] Phone numbers are in correct format
- [ ] Meeting times are in the future
- [ ] Status column says "Pending"
- [ ] No firewall blocking localhost
- [ ] Node.js version is 18+

---

**Still having issues?** Create a detailed bug report including:
- Error message (exact text)
- Steps to reproduce
- Backend logs
- Browser console logs
- Environment (OS, Node version, etc.)

---

**Last Updated:** December 2025
