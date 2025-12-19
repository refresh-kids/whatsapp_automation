# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
- [ ] Node.js installed (v18+)
- [ ] Google Cloud account created
- [ ] Meta Developer account created
- [ ] Google Sheet prepared

### Step 1: Install Dependencies (2 minutes)

```bash
# Install all dependencies at once
npm run install-all
```

### Step 2: Configure Environment (2 minutes)

1. Copy example environment file:
```bash
cd backend
cp ../.env.example .env
```

2. Edit `backend/.env` with your credentials:
   - Google Sheets: Service account email and private key
   - WhatsApp: API token and phone number ID
   - Admin: Set your email and password

### Step 3: Prepare Google Sheet (1 minute)

Create a sheet with these columns:
```
teacher_name | student_name | phone_number | message | meeting_date | meeting_time | status | sent_at
```

Add sample data:
```
John Smith | Alice | 14155551234 | Hi {{student_name}}, meeting at {{meeting_time}} | 2025-12-20 | 14:30 | Pending |
```

Share the sheet with your service account email.

### Step 4: Run the Application (30 seconds)

```bash
# From root directory
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000).

### Step 5: Login and Test

1. Open http://localhost:3000
2. Login with credentials from `.env`:
   - Email: admin@example.com
   - Password: your_secure_password
3. Click "Sync Sheet" to load data
4. View messages in the Messages page

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can login to dashboard
- [ ] Messages appear in Messages page
- [ ] Scheduler status shows "Running"

## 🎯 Test Message Sending

To test immediately without waiting:

1. In Google Sheet, set a meeting time to **current time + 20 minutes**
2. Wait for the scheduler to check (every 1 minute)
3. At 15 minutes before meeting time, message will be sent
4. Check the Logs page for status

## 🐛 Quick Troubleshooting

**Can't login?**
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`

**No messages showing?**
- Click "Sync Sheet" button
- Verify Google Sheet ID in `.env`
- Check service account has access to sheet

**Messages not sending?**
- Verify WhatsApp API credentials
- Check phone number format (no + symbol)
- Ensure meeting time is in the future

## 📚 Next Steps

- Read full [README.md](README.md) for detailed documentation
- Check [GOOGLE_SHEET_SCHEMA.md](GOOGLE_SHEET_SCHEMA.md) for sheet format details
- Review API endpoints in README
- Configure production deployment

## 🆘 Need Help?

1. Check error messages in browser console
2. Review backend terminal for errors
3. Check Logs page in dashboard
4. Verify all environment variables are set correctly

---

**You're all set! 🎉**
