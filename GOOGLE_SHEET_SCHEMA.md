# Google Sheet Schema for WhatsApp Automation

## Required Columns

Your Google Sheet **MUST** have exactly these columns in this order:

### Column Structure

| Column Letter | Column Name     | Data Type | Required | Description |
|---------------|----------------|-----------|----------|-------------|
| A             | teacher_name   | Text      | Yes      | Name of the teacher conducting the meeting |
| B             | student_name   | Text      | Yes      | Name of the student attending the meeting |
| C             | phone_number   | Text      | Yes      | Student's phone number (country code, no + symbol) |
| D             | message        | Text      | Yes      | Message template with placeholders |
| E             | meeting_date   | Date      | Yes      | Date of the meeting (YYYY-MM-DD format) |
| F             | meeting_time   | Time      | Yes      | Time of the meeting (HH:mm 24-hour format) |
| G             | status         | Text      | Yes      | Current status (Pending/Sent/Failed) |
| H             | sent_at        | Timestamp | No       | Auto-filled by system when message is sent |

## Column Details

### A. teacher_name
- **Format:** Plain text
- **Example:** "John Smith", "Dr. Sarah Johnson"
- **Max Length:** 100 characters
- **Required:** Yes

### B. student_name
- **Format:** Plain text
- **Example:** "Alice Brown", "Bob Williams"
- **Max Length:** 100 characters
- **Required:** Yes

### C. phone_number
- **Format:** Numbers only, with country code, NO + symbol
- **Example:** 
  - US: `14155551234` (not `+1 415-555-1234`)
  - UK: `447911123456` (not `+44 7911 123456`)
  - India: `919876543210` (not `+91 98765 43210`)
- **Required:** Yes
- **Validation:** Must be 10-15 digits

### D. message
- **Format:** Plain text with optional placeholders
- **Available Placeholders:**
  - `{{teacher_name}}` - Replaced with teacher's name
  - `{{student_name}}` - Replaced with student's name
  - `{{meeting_date}}` - Replaced with meeting date
  - `{{meeting_time}}` - Replaced with meeting time
- **Example:**
  ```
  Hi {{student_name}}, this is a reminder that you have a meeting with {{teacher_name}} scheduled for {{meeting_date}} at {{meeting_time}}. Please be on time!
  ```
- **Max Length:** 1000 characters
- **Required:** Yes

### E. meeting_date
- **Format:** YYYY-MM-DD
- **Example:** 
  - `2025-12-20`
  - `2026-01-15`
- **Required:** Yes
- **Note:** Must be a future date

### F. meeting_time
- **Format:** HH:mm (24-hour format)
- **Example:**
  - `14:30` (2:30 PM)
  - `09:00` (9:00 AM)
  - `18:45` (6:45 PM)
- **Required:** Yes
- **Note:** Minutes must be included (e.g., `09:00`, not `9`)

### G. status
- **Format:** Text (case-insensitive)
- **Allowed Values:**
  - `Pending` - Message waiting to be sent
  - `Sent` - Message successfully sent
  - `Failed` - Message failed to send
- **Default:** `Pending`
- **Required:** Yes
- **Note:** Auto-updated by system after send attempt

### H. sent_at
- **Format:** ISO 8601 timestamp
- **Example:** `2025-12-20T14:15:00.000Z`
- **Required:** No
- **Note:** Automatically filled by system when message is sent

## Sample Data

Here's a complete example with 3 rows:

| teacher_name | student_name | phone_number | message | meeting_date | meeting_time | status | sent_at |
|--------------|--------------|--------------|---------|--------------|--------------|--------|---------|
| John Smith | Alice Johnson | 14155551234 | Hi {{student_name}}, reminder: Meeting with {{teacher_name}} on {{meeting_date}} at {{meeting_time}}. | 2025-12-20 | 14:30 | Pending | |
| Dr. Sarah Lee | Bob Williams | 447911123456 | Hello {{student_name}}, your session with {{teacher_name}} is at {{meeting_time}} today. | 2025-12-20 | 15:00 | Pending | |
| Prof. Mike Chen | Carol Davis | 919876543210 | Dear {{student_name}}, this is to remind you about your meeting scheduled for {{meeting_date}} at {{meeting_time}} with {{teacher_name}}. | 2025-12-21 | 10:00 | Pending | |

## Setup Instructions

### 1. Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it (e.g., "WhatsApp Automation Messages")

### 2. Set Up Header Row

In Row 1, enter these exact column names:
```
A1: teacher_name
B1: student_name
C1: phone_number
D1: message
E1: meeting_date
F1: meeting_time
G1: status
H1: sent_at
```

### 3. Format Columns

**Optional but recommended:**

1. **Column C (phone_number):**
   - Select entire column C
   - Format > Number > Plain text

2. **Column E (meeting_date):**
   - Select entire column E
   - Format > Number > Date
   - Choose format: YYYY-MM-DD

3. **Column F (meeting_time):**
   - Select entire column F
   - Format > Number > Time
   - Choose format: HH:mm (24-hour)

4. **Column G (status):**
   - Select entire column G
   - Data > Data validation
   - Criteria: List of items
   - Items: `Pending, Sent, Failed`

### 4. Add Data

Start adding your data from Row 2 onwards. Follow the format specified above.

### 5. Share with Service Account

1. Click the "Share" button in the top-right
2. Add the service account email from your Google Cloud credentials
3. Give it "Editor" permissions
4. Uncheck "Notify people"
5. Click "Share"

## Phone Number Formats by Country

| Country | Code | Format | Example |
|---------|------|--------|---------|
| USA | 1 | 1XXXXXXXXXX | 14155551234 |
| UK | 44 | 44XXXXXXXXXX | 447911123456 |
| India | 91 | 91XXXXXXXXXX | 919876543210 |
| Canada | 1 | 1XXXXXXXXXX | 14165551234 |
| Australia | 61 | 61XXXXXXXXX | 61412345678 |
| Germany | 49 | 49XXXXXXXXXX | 491521234567 |
| France | 33 | 33XXXXXXXXX | 33612345678 |
| Spain | 34 | 34XXXXXXXXX | 34612345678 |
| Brazil | 55 | 55XXXXXXXXXXX | 5511987654321 |

**Remember:** NO + symbol, NO spaces, NO dashes, NO parentheses!

## Message Template Best Practices

### Good Examples:

✅ **Formal:**
```
Dear {{student_name}}, this is a reminder that you have a scheduled meeting with {{teacher_name}} on {{meeting_date}} at {{meeting_time}}. Please arrive 5 minutes early. Thank you!
```

✅ **Casual:**
```
Hey {{student_name}}! Quick reminder about your session with {{teacher_name}} today at {{meeting_time}}. See you there! 😊
```

✅ **Detailed:**
```
Hi {{student_name}}, your meeting with {{teacher_name}} is scheduled for {{meeting_date}} at {{meeting_time}}. Please bring your notes and be prepared to discuss your progress. Looking forward to seeing you!
```

### Bad Examples:

❌ **Missing placeholders:**
```
Hi, your meeting is at 2 PM tomorrow.
```
(Not dynamic, won't work for all rows)

❌ **Too long:**
```
[Very long message exceeding 1000 characters...]
```
(WhatsApp may reject very long messages)

❌ **Invalid placeholders:**
```
Hi {{name}}, meeting with {{prof}} at {{time}}.
```
(Invalid placeholder names)

## Trigger Logic

The system automatically sends messages **15 minutes BEFORE** the scheduled meeting time.

**Example:**
- Meeting Date: 2025-12-20
- Meeting Time: 14:30
- Message will be sent at: 14:15 (2:15 PM)

## Status Workflow

```
Pending → [System checks] → Sent ✅
                          → Failed ❌
```

1. **Pending**: Initial status, waiting to be sent
2. **Sent**: Successfully delivered to WhatsApp
3. **Failed**: Delivery failed (check logs for reason)

## Common Issues

### Issue 1: Phone Number Not Working
- ❌ Wrong: `+1 (415) 555-1234`
- ✅ Correct: `14155551234`

### Issue 2: Date Format Error
- ❌ Wrong: `12/20/2025` or `20-12-2025`
- ✅ Correct: `2025-12-20`

### Issue 3: Time Format Error
- ❌ Wrong: `2:30 PM` or `14:30:00`
- ✅ Correct: `14:30`

### Issue 4: Status Not Updating
- Check if service account has "Editor" permissions
- Verify Google Sheets API is enabled
- Check backend logs for errors

## Tips for Success

1. **Always use the Pending status** for new rows
2. **Test with one row first** before adding many
3. **Use valid phone numbers** (test numbers work in sandbox mode)
4. **Keep messages under 500 characters** for best results
5. **Schedule meetings at least 30 minutes in the future**
6. **Double-check date and time formats**
7. **Use placeholders** to personalize messages
8. **Don't manually edit sent_at column** - it's auto-managed

## Need Help?

If your messages aren't sending:
1. Check the Logs page in the dashboard
2. Verify all columns are filled correctly
3. Ensure phone numbers are in the correct format
4. Confirm meeting date/time is in the future
5. Check WhatsApp API credentials are valid

---

**Sheet Name:** Use "Sheet1" as the default name (or configure in backend)

**Last Updated:** December 2025
