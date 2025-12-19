"""
Example usage script for WhatsApp Automation

This script demonstrates various ways to use the WhatsApp automation bot.
"""

from whatsapp_bot import WhatsAppAutomation
import time


def example_single_message():
    """
    Example: Send a single message to a contact
    """
    print("=== Example: Single Message ===")
    
    # Create bot instance
    bot = WhatsAppAutomation()
    
    # Start WhatsApp Web
    if not bot.start():
        print("Failed to start WhatsApp Web")
        return
    
    try:
        # Send message
        contact = "John Doe"  # Replace with actual contact name
        message = "Hello! This is a test message."
        bot.send_message(contact, message)
        
        # Wait a bit before closing
        time.sleep(3)
    
    finally:
        bot.quit()


def example_bulk_messages():
    """
    Example: Send messages to multiple contacts
    """
    print("=== Example: Bulk Messages ===")
    
    # Create bot instance
    bot = WhatsAppAutomation()
    
    # Start WhatsApp Web
    if not bot.start():
        print("Failed to start WhatsApp Web")
        return
    
    try:
        # List of contacts
        contacts = [
            "Alice Smith",
            "Bob Johnson",
            "Carol Williams"
        ]
        
        # Message to send
        message = "Hello! This is a bulk message sent to all of you."
        
        # Send bulk messages
        results = bot.send_bulk_messages(contacts, message)
        
        # Print results
        print("\n=== Results ===")
        for contact, success in results.items():
            status = "✓ Success" if success else "✗ Failed"
            print(f"{contact}: {status}")
        
        # Wait a bit before closing
        time.sleep(3)
    
    finally:
        bot.quit()


def example_send_attachment():
    """
    Example: Send a file attachment to a contact
    """
    print("=== Example: Send Attachment ===")
    
    # Create bot instance
    bot = WhatsAppAutomation()
    
    # Start WhatsApp Web
    if not bot.start():
        print("Failed to start WhatsApp Web")
        return
    
    try:
        # Send attachment
        contact = "Jane Doe"  # Replace with actual contact name
        file_path = "path/to/your/file.pdf"  # Replace with actual file path
        bot.send_attachment(contact, file_path)
        
        # Wait a bit before closing
        time.sleep(3)
    
    finally:
        bot.quit()


def example_interactive():
    """
    Example: Interactive mode - keeps browser open for manual operations
    """
    print("=== Example: Interactive Mode ===")
    
    # Create bot instance
    bot = WhatsAppAutomation()
    
    # Start WhatsApp Web
    if not bot.start():
        print("Failed to start WhatsApp Web")
        return
    
    try:
        print("\nBrowser is open. You can manually interact with WhatsApp Web.")
        print("Press Ctrl+C to quit.\n")
        
        # Keep running until user interrupts
        while True:
            time.sleep(1)
    
    except KeyboardInterrupt:
        print("\nClosing...")
    
    finally:
        bot.quit()


if __name__ == "__main__":
    print("WhatsApp Automation Examples")
    print("=" * 40)
    print("\nSelect an example to run:")
    print("1. Send single message")
    print("2. Send bulk messages")
    print("3. Send attachment")
    print("4. Interactive mode")
    print("0. Exit")
    
    choice = input("\nEnter your choice (0-4): ")
    
    if choice == "1":
        example_single_message()
    elif choice == "2":
        example_bulk_messages()
    elif choice == "3":
        example_send_attachment()
    elif choice == "4":
        example_interactive()
    elif choice == "0":
        print("Goodbye!")
    else:
        print("Invalid choice!")
