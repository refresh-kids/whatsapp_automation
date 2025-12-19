"""
WhatsApp Automation Module

This module provides functionality to automate WhatsApp Web operations
including sending messages, images, and documents to contacts or groups.
"""

import time
import os
import configparser
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import TimeoutException, NoSuchElementException


class WhatsAppAutomation:
    """
    A class to automate WhatsApp Web operations using Selenium WebDriver.
    """

    def __init__(self, config_path='config.ini'):
        """
        Initialize the WhatsApp automation bot.

        Args:
            config_path (str): Path to the configuration file
        """
        self.config = self._load_config(config_path)
        self.driver = None
        self.wait = None

    def _load_config(self, config_path):
        """
        Load configuration from INI file.

        Args:
            config_path (str): Path to configuration file

        Returns:
            configparser.ConfigParser: Configuration object
        """
        config = configparser.ConfigParser()
        
        # Set default values
        config['Settings'] = {
            'qr_wait_time': '30',
            'element_wait_time': '10',
            'headless': 'False'
        }
        
        if os.path.exists(config_path):
            config.read(config_path)
        
        return config

    def start(self):
        """
        Start the WhatsApp Web session by opening Chrome and loading WhatsApp Web.
        User needs to scan QR code to authenticate.
        """
        print("Starting WhatsApp automation...")
        
        # Setup Chrome options
        chrome_options = Options()
        
        # Add user data directory if specified
        profile_path = self.config.get('Chrome', 'profile_path', fallback='')
        if profile_path and os.path.exists(profile_path):
            chrome_options.add_argument(f'--user-data-dir={profile_path}')
        
        # Set headless mode if enabled
        headless = self.config.getboolean('Settings', 'headless', fallback=False)
        if headless:
            chrome_options.add_argument('--headless')
        
        # Additional options for stability
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # Initialize WebDriver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.driver.maximize_window()
        
        # Set up wait
        wait_time = self.config.getint('Settings', 'element_wait_time', fallback=10)
        self.wait = WebDriverWait(self.driver, wait_time)
        
        # Open WhatsApp Web
        self.driver.get('https://web.whatsapp.com')
        print("WhatsApp Web opened. Please scan the QR code if required.")
        
        # Wait for user to scan QR code
        qr_wait_time = self.config.getint('Settings', 'qr_wait_time', fallback=30)
        try:
            # Wait for the main page to load (search box appears after login)
            qr_wait = WebDriverWait(self.driver, qr_wait_time)
            qr_wait.until(EC.presence_of_element_located(
                (By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]')
            ))
            print("Successfully logged in to WhatsApp Web!")
        except TimeoutException:
            print("Timeout waiting for login. Please ensure you scan the QR code.")
            self.quit()
            return False
        
        return True

    def search_contact(self, contact_name):
        """
        Search for a contact or group by name.

        Args:
            contact_name (str): Name of the contact or group to search

        Returns:
            bool: True if contact found, False otherwise
        """
        try:
            # Click on search box
            search_box = self.wait.until(EC.presence_of_element_located(
                (By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]')
            ))
            search_box.click()
            
            # Wait for search box to be active
            self.wait.until(EC.element_to_be_clickable(
                (By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]')
            ))
            
            # Type contact name
            search_box.send_keys(contact_name)
            
            # Wait for search results to appear
            time.sleep(1)  # Brief wait for search to process
            
            # Click on the first result
            contact = self.wait.until(EC.presence_of_element_located(
                (By.XPATH, f'//span[@title="{contact_name}"]')
            ))
            contact.click()
            
            # Wait for chat to load
            self.wait.until(EC.presence_of_element_located(
                (By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
            ))
            
            print(f"Contact '{contact_name}' selected successfully.")
            return True
        
        except (TimeoutException, NoSuchElementException) as e:
            print(f"Error finding contact '{contact_name}': {str(e)}")
            return False

    def send_message(self, contact_name, message):
        """
        Send a text message to a contact or group.

        Args:
            contact_name (str): Name of the contact or group
            message (str): Message text to send

        Returns:
            bool: True if message sent successfully, False otherwise
        """
        try:
            # Search and select contact
            if not self.search_contact(contact_name):
                return False
            
            # Find message input box
            message_box = self.wait.until(EC.presence_of_element_located(
                (By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
            ))
            
            # Type and send message
            message_box.click()
            message_box.send_keys(message)
            message_box.send_keys(Keys.ENTER)
            
            print(f"Message sent to '{contact_name}' successfully!")
            time.sleep(1)
            return True
        
        except (TimeoutException, NoSuchElementException) as e:
            print(f"Error sending message: {str(e)}")
            return False

    def send_attachment(self, contact_name, file_path):
        """
        Send a file attachment to a contact or group.

        Args:
            contact_name (str): Name of the contact or group
            file_path (str): Path to the file to send

        Returns:
            bool: True if file sent successfully, False otherwise
        """
        try:
            # Check if file exists
            if not os.path.exists(file_path):
                print(f"File not found: {file_path}")
                return False
            
            # Search and select contact
            if not self.search_contact(contact_name):
                return False
            
            # Click on attachment button
            attach_btn = self.wait.until(EC.presence_of_element_located(
                (By.XPATH, '//div[@title="Attach"]')
            ))
            attach_btn.click()
            time.sleep(0.5)
            
            # Click on document/image option based on file type
            file_ext = os.path.splitext(file_path)[1].lower()
            if file_ext in ['.jpg', '.jpeg', '.png', '.gif']:
                # Click on photos & videos option
                attach_type = self.wait.until(EC.presence_of_element_located(
                    (By.XPATH, '//input[@accept="image/*,video/mp4,video/3gpp,video/quicktime"]')
                ))
            else:
                # Click on document option
                attach_type = self.wait.until(EC.presence_of_element_located(
                    (By.XPATH, '//input[@accept="*"]')
                ))
            
            # Upload file
            attach_type.send_keys(os.path.abspath(file_path))
            time.sleep(2)
            
            # Click send button
            send_btn = self.wait.until(EC.presence_of_element_located(
                (By.XPATH, '//span[@data-icon="send"]')
            ))
            send_btn.click()
            
            print(f"File sent to '{contact_name}' successfully!")
            time.sleep(2)
            return True
        
        except (TimeoutException, NoSuchElementException) as e:
            print(f"Error sending attachment: {str(e)}")
            return False

    def send_bulk_messages(self, contacts, message):
        """
        Send the same message to multiple contacts.

        Args:
            contacts (list): List of contact names
            message (str): Message to send

        Returns:
            dict: Dictionary with contact names as keys and success status as values
        """
        results = {}
        for contact in contacts:
            print(f"\nSending message to {contact}...")
            success = self.send_message(contact, message)
            results[contact] = success
            time.sleep(2)  # Delay between messages
        
        return results

    def quit(self):
        """
        Close the browser and end the session.
        """
        if self.driver:
            print("Closing WhatsApp automation...")
            self.driver.quit()
            print("Browser closed successfully.")


def main():
    """
    Example usage of WhatsAppAutomation class.
    """
    # Create instance
    bot = WhatsAppAutomation()
    
    # Start WhatsApp Web
    if not bot.start():
        return
    
    try:
        # Example: Send a message
        contact_name = "Test Contact"  # Replace with actual contact name
        message = "Hello! This is an automated message from WhatsApp Automation bot."
        bot.send_message(contact_name, message)
        
        # Keep browser open for a while
        time.sleep(5)
    
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    
    finally:
        # Close the browser
        bot.quit()


if __name__ == "__main__":
    main()
