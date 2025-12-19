"""
Basic tests for WhatsApp Automation

These tests verify that the module can be imported and basic initialization works.
"""

import unittest
import os
import sys
import configparser

# Add parent directory to path to import the module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from whatsapp_bot import WhatsAppAutomation


class TestWhatsAppAutomation(unittest.TestCase):
    """Test cases for WhatsAppAutomation class"""

    def test_import_module(self):
        """Test that the module can be imported"""
        self.assertIsNotNone(WhatsAppAutomation)

    def test_initialization_without_config(self):
        """Test that the bot can be initialized without a config file"""
        bot = WhatsAppAutomation()
        self.assertIsNotNone(bot)
        self.assertIsNotNone(bot.config)

    def test_initialization_with_example_config(self):
        """Test that the bot can be initialized with example config file"""
        if os.path.exists('config.example.ini'):
            bot = WhatsAppAutomation('config.example.ini')
            self.assertIsNotNone(bot)
            self.assertIsNotNone(bot.config)

    def test_default_config_values(self):
        """Test that default configuration values are set"""
        bot = WhatsAppAutomation()
        
        # Check that default settings exist
        self.assertTrue(bot.config.has_section('Settings'))
        self.assertEqual(bot.config.get('Settings', 'qr_wait_time'), '30')
        self.assertEqual(bot.config.get('Settings', 'element_wait_time'), '10')
        self.assertEqual(bot.config.get('Settings', 'headless'), 'False')

    def test_bot_has_required_methods(self):
        """Test that the bot has all required methods"""
        bot = WhatsAppAutomation()
        
        # Check that required methods exist
        self.assertTrue(hasattr(bot, 'start'))
        self.assertTrue(hasattr(bot, 'search_contact'))
        self.assertTrue(hasattr(bot, 'send_message'))
        self.assertTrue(hasattr(bot, 'send_attachment'))
        self.assertTrue(hasattr(bot, 'send_bulk_messages'))
        self.assertTrue(hasattr(bot, 'quit'))
        
        # Check that they are callable
        self.assertTrue(callable(bot.start))
        self.assertTrue(callable(bot.search_contact))
        self.assertTrue(callable(bot.send_message))
        self.assertTrue(callable(bot.send_attachment))
        self.assertTrue(callable(bot.send_bulk_messages))
        self.assertTrue(callable(bot.quit))

    def test_config_loading(self):
        """Test configuration loading functionality"""
        bot = WhatsAppAutomation()
        
        # Test config attribute types
        self.assertIsInstance(bot.config, configparser.ConfigParser)
        
        # Test config getters work
        qr_wait = bot.config.getint('Settings', 'qr_wait_time', fallback=30)
        self.assertIsInstance(qr_wait, int)
        
        headless = bot.config.getboolean('Settings', 'headless', fallback=False)
        self.assertIsInstance(headless, bool)


class TestExampleScript(unittest.TestCase):
    """Test cases for example_usage.py"""

    def test_import_example_module(self):
        """Test that the example module can be imported"""
        try:
            import example_usage
            self.assertIsNotNone(example_usage)
        except ImportError as e:
            self.fail(f"Failed to import example_usage: {e}")

    def test_example_functions_exist(self):
        """Test that example functions are defined"""
        import example_usage
        
        self.assertTrue(hasattr(example_usage, 'example_single_message'))
        self.assertTrue(hasattr(example_usage, 'example_bulk_messages'))
        self.assertTrue(hasattr(example_usage, 'example_send_attachment'))
        self.assertTrue(hasattr(example_usage, 'example_interactive'))


class TestProjectStructure(unittest.TestCase):
    """Test cases for project structure"""

    def test_required_files_exist(self):
        """Test that all required files exist"""
        required_files = [
            'whatsapp_bot.py',
            'example_usage.py',
            'requirements.txt',
            'README.md',
            '.gitignore',
            'config.example.ini'
        ]
        
        for filename in required_files:
            self.assertTrue(
                os.path.exists(filename),
                f"Required file {filename} does not exist"
            )

    def test_requirements_file_content(self):
        """Test that requirements.txt contains necessary dependencies"""
        with open('requirements.txt', 'r') as f:
            content = f.read()
        
        required_packages = ['selenium', 'webdriver-manager', 'python-dotenv']
        for package in required_packages:
            self.assertIn(
                package,
                content,
                f"Required package {package} not found in requirements.txt"
            )

    def test_gitignore_includes_common_patterns(self):
        """Test that .gitignore includes common Python patterns"""
        with open('.gitignore', 'r') as f:
            content = f.read()
        
        common_patterns = ['__pycache__', '*.py[cod]', 'venv/', '.env']
        for pattern in common_patterns:
            self.assertIn(
                pattern,
                content,
                f"Pattern {pattern} not found in .gitignore"
            )


if __name__ == '__main__':
    unittest.main()
