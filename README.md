# 📱 WhatsApp Automation Web Application

A full-stack web application that automatically sends WhatsApp messages to students 15 minutes before their scheduled meetings using Google Sheets as the data source.

## 🎯 Features

- ✅ **Google Sheets Integration** - Uses Google Sheets as the primary database
- ✅ **WhatsApp Cloud API** - Sends messages via Meta's WhatsApp Business Platform
- ✅ **Automatic Scheduling** - Sends messages 15 minutes before meeting time
- ✅ **Real-time Dashboard** - View statistics and monitor system status
- ✅ **Message Logging** - Track all sent and failed messages
- ✅ **Admin Authentication** - Secure login with JWT tokens
- ✅ **Background Scheduler** - Automated message checking and sending
- ✅ **Manual Controls** - Trigger sync and message checks manually

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **Google Sheets API** for data management
- **WhatsApp Cloud API** (Meta) for messaging
- **Node Cron** for scheduling
- **JWT** for authentication
- **Helmet** & **Rate Limiting** for security

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **date-fns** for date formatting

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Google Cloud Account** - For Google Sheets API
3. **Meta Developer Account** - For WhatsApp Cloud API
4. **Google Sheet** - Prepared with the required format

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd whatsapp_automation
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Google Sheets API Setup

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

#### Step 2: Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details
4. Click "Create and Continue"
5. Skip optional steps and click "Done"

#### Step 3: Generate Service Account Key
1. Click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose "JSON" format
5. Save the downloaded JSON file securely

#### Step 4: Share Your Google Sheet
1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (found in the JSON file: `client_email`)
4. Give it "Editor" permissions

### 4. WhatsApp Cloud API Setup

#### Step 1: Create Meta Developer Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an account or log in
3. Create a new App

#### Step 2: Add WhatsApp Product
1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Follow the setup wizard

#### Step 3: Get API Credentials
1. Go to WhatsApp > API Setup
2. Note down:
   - **Phone Number ID**
   - **WhatsApp Business Account ID**
3. Generate a **Permanent Access Token**:
   - Go to "System Users" in Business Settings
   - Create a system user
   - Generate a token with `whatsapp_business_messaging` permission

#### Step 4: Verify Your Phone Number
Follow Meta's instructions to verify your business phone number

### 5. Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp ../.env.example .env
```

Edit `.env` with your credentials:

```env
# Backend Server
PORT=5000
NODE_ENV=development

# Admin Authentication
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# Google Sheets API
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_google_sheet_id

# WhatsApp Cloud API
WHATSAPP_API_TOKEN=your_whatsapp_cloud_api_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Scheduler Configuration
SYNC_INTERVAL_MINUTES=5
CHECK_INTERVAL_MINUTES=1
```

**Important Notes:**
- `GOOGLE_SHEETS_PRIVATE_KEY`: Copy from the service account JSON file
- `GOOGLE_SHEET_ID`: Found in your Google Sheet URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
- Keep your `.env` file secure and never commit it to version control

## 📊 Google Sheet Format

Create a Google Sheet with the following columns:

| Column | Description | Format | Example |
|--------|-------------|--------|---------|
| teacher_name | Name of the teacher | Text | John Smith |
| student_name | Name of the student | Text | Alice Johnson |
| phone_number | Student's phone number | Number (no +) | 1234567890 |
| message | Message template | Text | Hi {{student_name}}, your meeting with {{teacher_name}} is scheduled for {{meeting_date}} at {{meeting_time}}. |
| meeting_date | Meeting date | YYYY-MM-DD | 2025-12-25 |
| meeting_time | Meeting time | HH:mm (24-hour) | 14:30 |
| status | Message status | Text | Pending |
| sent_at | Timestamp when sent | ISO Date | (Auto-filled) |

### Sample Data

```
teacher_name | student_name | phone_number | message | meeting_date | meeting_time | status | sent_at
John Smith   | Alice Johnson| 1234567890   | Hi {{student_name}}, your meeting with {{teacher_name}} is at {{meeting_time}} on {{meeting_date}}. | 2025-12-20 | 14:30 | Pending |
Jane Doe     | Bob Williams | 9876543210   | Hello {{student_name}}, reminder: Meeting with {{teacher_name}} at {{meeting_time}}. | 2025-12-20 | 15:00 | Pending |
```

**Message Placeholders:**
- `{{teacher_name}}` - Will be replaced with teacher's name
- `{{student_name}}` - Will be replaced with student's name
- `{{meeting_date}}` - Will be replaced with meeting date
- `{{meeting_time}}` - Will be replaced with meeting time

## 🎬 Running the Application

### Development Mode

#### Option 1: Run Everything Together
```bash
# From root directory
npm run dev
```

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Mode

#### Backend:
```bash
cd backend
npm start
```

#### Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

### Default Login Credentials

- **Email:** admin@example.com
- **Password:** your_secure_password

⚠️ **Change these credentials in production!**

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Google Sheet
- `GET /api/sheet/messages` - Get all messages
- `GET /api/sheet/pending` - Get pending messages
- `GET /api/sheet/stats` - Get dashboard statistics
- `POST /api/sheet/sync` - Manually sync Google Sheet

### Scheduler
- `GET /api/scheduler/status` - Get scheduler status
- `POST /api/scheduler/trigger` - Manually trigger message check
- `GET /api/scheduler/logs` - Get message logs
- `DELETE /api/scheduler/logs` - Clear message logs
- `GET /api/scheduler/health` - Check WhatsApp API health

## 🔄 How It Works

1. **Data Source**: Google Sheet contains all meeting information
2. **Scheduler**: Runs every minute checking for messages to send
3. **Trigger Logic**: Calculates trigger time as `meeting_datetime - 15 minutes`
4. **Message Sending**: When trigger time is reached, sends WhatsApp message
5. **Status Update**: Updates Google Sheet status to "Sent" or "Failed"
6. **Logging**: All attempts are logged and viewable in the dashboard

## 🎨 Dashboard Features

### 1. Dashboard Page
- Total messages count
- Pending messages count
- Sent messages count
- Failed messages count
- Scheduler status and statistics
- Manual sync and trigger buttons

### 2. Messages Page
- View all messages from Google Sheet
- Filter by status (All, Pending, Sent, Failed)
- Real-time data updates
- Manual refresh option

### 3. Logs Page
- View all WhatsApp send attempts
- Success and failure indicators
- Timestamps and error details
- Clear logs functionality

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Rate limiting on API endpoints
- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Environment variable protection
- ✅ Input validation
- ✅ Phone number validation

## 🐛 Troubleshooting

### Backend Won't Start
1. Check if `.env` file exists in `backend` directory
2. Verify all environment variables are set
3. Ensure Google Sheets API credentials are correct
4. Check if port 5000 is available

### Frontend Won't Start
1. Ensure all dependencies are installed
2. Check if port 3000 is available
3. Verify backend is running

### Messages Not Sending
1. Verify WhatsApp API credentials
2. Check phone number format (no + sign, just numbers)
3. Ensure WhatsApp message templates are approved
4. Check scheduler status in dashboard
5. View logs page for error details

### Google Sheets Connection Issues
1. Verify service account email has access to the sheet
2. Check if Google Sheets API is enabled
3. Ensure GOOGLE_SHEET_ID is correct
4. Verify private key format in .env

### WhatsApp API Errors
1. Ensure access token is valid and not expired
2. Verify phone number ID is correct
3. Check if message templates are approved
4. Ensure phone numbers include country code

## 📝 Development Notes

### Project Structure

```
whatsapp_automation/
├── backend/
│   ├── config/
│   │   └── config.js          # Configuration management
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── sheetController.js # Google Sheets logic
│   │   └── schedulerController.js
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── sheetRoutes.js
│   │   └── schedulerRoutes.js
│   ├── services/
│   │   ├── googleSheetsService.js  # Google Sheets API
│   │   ├── whatsappService.js      # WhatsApp API
│   │   └── schedulerService.js     # Cron jobs
│   ├── .env
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # API client
│   │   ├── components/
│   │   │   ├── Layout.jsx     # Main layout
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Messages.jsx
│   │   │   └── Logs.jsx
│   │   ├── index.css
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Deployment

### Backend Deployment (Heroku Example)

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy:
```bash
git push heroku main
```

### Frontend Deployment (Vercel Example)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

3. Update API URL in frontend to point to production backend

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs in the dashboard
3. Verify all API credentials are correct
4. Ensure Google Sheet format matches requirements

## 🎉 Acknowledgments

- WhatsApp Cloud API by Meta
- Google Sheets API
- React and Vite communities
- Tailwind CSS team

---

**Made with ❤️ for automated WhatsApp messaging**
