# WhatsApp Automation - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### POST /auth/login
Login to get JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "your_secure_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "admin@example.com"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### GET /auth/verify
Verify if current JWT token is valid.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "email": "admin@example.com"
  }
}
```

---

## Google Sheet Endpoints

### GET /sheet/messages
Get all messages from Google Sheet.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "rowIndex": 2,
      "teacher_name": "John Smith",
      "student_name": "Alice Johnson",
      "phone_number": "14155551234",
      "message": "Hi {{student_name}}, meeting at {{meeting_time}}",
      "meeting_date": "2025-12-20",
      "meeting_time": "14:30",
      "status": "Pending",
      "sent_at": ""
    }
  ],
  "count": 1
}
```

---

### GET /sheet/pending
Get only pending messages that are ready to be sent.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "rowIndex": 2,
      "teacher_name": "John Smith",
      "student_name": "Alice Johnson",
      "phone_number": "14155551234",
      "message": "Hi {{student_name}}, meeting at {{meeting_time}}",
      "meeting_date": "2025-12-20",
      "meeting_time": "14:30",
      "status": "Pending",
      "sent_at": ""
    }
  ],
  "count": 1
}
```

---

### GET /sheet/stats
Get dashboard statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 5,
    "sent": 3,
    "failed": 2
  }
}
```

---

### POST /sheet/sync
Manually sync Google Sheet data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sheet synced successfully",
  "data": {
    "count": 10,
    "syncedAt": "2025-12-18T10:30:00.000Z"
  }
}
```

---

## Scheduler Endpoints

### GET /scheduler/status
Get current scheduler status and statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isRunning": true,
    "lastSync": "2025-12-18T10:25:00.000Z",
    "lastCheck": "2025-12-18T10:30:00.000Z",
    "messagesSent": 15,
    "messagesFailed": 2,
    "checkInterval": "1 minute(s)",
    "syncInterval": "5 minute(s)"
  }
}
```

---

### POST /scheduler/trigger
Manually trigger a message check (bypasses scheduler).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Message check triggered successfully",
  "data": {
    "triggeredAt": "2025-12-18T10:35:00.000Z"
  }
}
```

---

### GET /scheduler/logs
Get WhatsApp message send logs.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of logs to return (default: 100)

**Example:**
```
GET /scheduler/logs?limit=50
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-12-18T10:30:00.000Z",
      "phone": "14155551234",
      "status": "success",
      "messageId": "wamid.HBgNMTQxNTU1NTEyMzQVAgARGBI5...",
      "response": {
        "messaging_product": "whatsapp",
        "contacts": [
          {
            "input": "14155551234",
            "wa_id": "14155551234"
          }
        ],
        "messages": [
          {
            "id": "wamid.HBgNMTQxNTU1NTEyMzQVAgARGBI5..."
          }
        ]
      }
    },
    {
      "timestamp": "2025-12-18T10:28:00.000Z",
      "phone": "447911123456",
      "status": "failed",
      "error": {
        "message": "Invalid phone number format",
        "code": 400
      }
    }
  ],
  "count": 2
}
```

---

### DELETE /scheduler/logs
Clear all message logs.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Message logs cleared successfully"
}
```

---

### GET /scheduler/health
Check WhatsApp API connection health.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "healthy": true,
    "phoneNumber": {
      "verified_name": "Your Business Name",
      "display_phone_number": "+1 415-555-1234",
      "id": "1234567890"
    }
  }
}
```

**Error Response (200 OK but unhealthy):**
```json
{
  "success": true,
  "data": {
    "healthy": false,
    "error": {
      "message": "Invalid access token",
      "code": 190
    }
  }
}
```

---

## Health Check Endpoints

### GET /api/health
Check if server is running.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "status": "healthy",
    "timestamp": "2025-12-18T10:40:00.000Z",
    "environment": "development"
  }
}
```

---

### GET /
Root endpoint information.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "WhatsApp Automation API",
  "version": "1.0.0",
  "documentation": "/api"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Route not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

## Rate Limiting

All API endpoints are rate-limited:
- **Window:** 15 minutes (900,000ms)
- **Max Requests:** 100 requests per window

When rate limit is exceeded, you'll receive a 429 status code.

---

## Example Usage with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_secure_password"
  }'
```

### Get Messages (with token)
```bash
curl -X GET http://localhost:5000/api/sheet/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Trigger Manual Check
```bash
curl -X POST http://localhost:5000/api/scheduler/trigger \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Logs
```bash
curl -X GET "http://localhost:5000/api/scheduler/logs?limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Example Usage with JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login
const loginResponse = await api.post('/auth/login', {
  email: 'admin@example.com',
  password: 'your_secure_password',
});

const token = loginResponse.data.data.token;

// Set token for subsequent requests
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Get messages
const messagesResponse = await api.get('/sheet/messages');
console.log(messagesResponse.data);

// Get stats
const statsResponse = await api.get('/sheet/stats');
console.log(statsResponse.data);

// Trigger check
const triggerResponse = await api.post('/scheduler/trigger');
console.log(triggerResponse.data);
```

---

## WebSocket Support

Currently not implemented. All data fetching is via REST API with polling.
For real-time updates, the frontend polls every 30 seconds on the dashboard.

---

## API Versioning

Current version: **v1** (implicit, no version in URL)

Future versions may use: `/api/v2/...`

---

## Security Notes

1. **Always use HTTPS in production**
2. **Keep JWT_SECRET secure and random**
3. **Never expose API tokens in client-side code**
4. **Rotate access tokens regularly**
5. **Use environment variables for all secrets**
6. **Enable CORS only for trusted domains in production**

---

**Last Updated:** December 2025
**API Version:** 1.0.0
