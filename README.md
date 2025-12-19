# WhatsApp Automation

A Python-based WhatsApp automation tool that uses Selenium WebDriver to automate WhatsApp Web operations. This tool allows you to send messages, images, documents, and perform bulk messaging operations programmatically.

## Features

- 🚀 Easy setup and configuration
- 📱 Send text messages to contacts or groups
- 📎 Send attachments (images, documents, videos)
- 📨 Bulk messaging to multiple contacts
- 🔐 Session persistence with Chrome profiles
- ⚙️ Configurable settings via INI file
- 🎯 Simple and intuitive Python API

## Prerequisites

- Python 3.7 or higher
- Google Chrome browser installed
- Active WhatsApp account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/refresh-kids/whatsapp_automation.git
cd whatsapp_automation
```

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

3. Create a configuration file (optional):
```bash
cp config.example.ini config.ini
```

Edit `config.ini` to customize settings like QR code wait time, Chrome profile path, etc.

## Quick Start

### Basic Usage

```python
from whatsapp_bot import WhatsAppAutomation

# Create bot instance
bot = WhatsAppAutomation()

# Start WhatsApp Web (scan QR code if needed)
bot.start()

# Send a message
bot.send_message("Contact Name", "Hello, this is an automated message!")

# Close the browser
bot.quit()
```

### Send Message Example

```python
from whatsapp_bot import WhatsAppAutomation

bot = WhatsAppAutomation()

if bot.start():
    # Send message to a contact
    bot.send_message("John Doe", "Hello John! How are you?")
    
    # Send message to a group
    bot.send_message("Family Group", "Good morning everyone!")
    
    bot.quit()
```

### Send Attachment Example

```python
from whatsapp_bot import WhatsAppAutomation

bot = WhatsAppAutomation()

if bot.start():
    # Send an image
    bot.send_attachment("Jane Smith", "/path/to/image.jpg")
    
    # Send a document
    bot.send_attachment("Bob Johnson", "/path/to/document.pdf")
    
    bot.quit()
```

### Bulk Messaging Example

```python
from whatsapp_bot import WhatsAppAutomation

bot = WhatsAppAutomation()

if bot.start():
    contacts = ["Alice", "Bob", "Charlie"]
    message = "Hello! This is a bulk message."
    
    results = bot.send_bulk_messages(contacts, message)
    
    # Print results
    for contact, success in results.items():
        print(f"{contact}: {'Success' if success else 'Failed'}")
    
    bot.quit()
```

## Running Examples

The repository includes an example script with various use cases:

```bash
python example_usage.py
```

This will present you with a menu to try different features:
1. Send single message
2. Send bulk messages
3. Send attachment
4. Interactive mode

## Configuration

The `config.ini` file allows you to customize the bot's behavior:

```ini
[WhatsApp]
# Phone numbers in international format (optional)
phone_number = 

[Chrome]
# Path to Chrome profile directory for session persistence
profile_path = 

[Settings]
# Time to wait for QR code scan (seconds)
qr_wait_time = 30
# Time to wait for page elements (seconds)
element_wait_time = 10
# Enable headless mode (True/False)
headless = False
```

## API Reference

### WhatsAppAutomation Class

#### Methods

- `__init__(config_path='config.ini')` - Initialize the bot with optional config file
- `start()` - Start WhatsApp Web session (returns True if successful)
- `search_contact(contact_name)` - Search and select a contact or group
- `send_message(contact_name, message)` - Send a text message
- `send_attachment(contact_name, file_path)` - Send a file attachment
- `send_bulk_messages(contacts, message)` - Send message to multiple contacts
- `quit()` - Close the browser and end session

## How It Works

1. The bot opens WhatsApp Web in Chrome using Selenium WebDriver
2. On first run, you need to scan the QR code with your phone
3. If you specify a Chrome profile path, the session will be saved for future use
4. The bot then automates interactions with WhatsApp Web interface
5. You can send messages, files, and perform other operations programmatically

## Important Notes

- ⚠️ **Use Responsibly**: This tool is for automation purposes. Do not use it for spam or any activities that violate WhatsApp's Terms of Service
- 📱 **First Time Setup**: On first run, you'll need to scan the QR code with your WhatsApp mobile app
- 💾 **Session Persistence**: To avoid scanning QR code every time, set a Chrome profile path in config
- 🕐 **Rate Limiting**: Add delays between messages to avoid being flagged by WhatsApp
- 🔒 **Security**: Never share your session data or Chrome profile with others

## Troubleshooting

### QR Code Timeout
- Increase `qr_wait_time` in config.ini
- Make sure Chrome browser is visible (not in headless mode for first login)

### Element Not Found Errors
- Increase `element_wait_time` in config.ini
- Check if WhatsApp Web interface has changed
- Ensure stable internet connection

### Chrome Driver Issues
- The script automatically downloads the correct ChromeDriver version
- If issues persist, manually update Chrome browser to the latest version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is provided as-is for educational and automation purposes.

## Disclaimer

This is an unofficial tool and is not affiliated with, authorized, maintained, sponsored, or endorsed by WhatsApp or any of its affiliates or subsidiaries. This is an independent and unofficial software. Use at your own risk.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ for automation enthusiasts**
