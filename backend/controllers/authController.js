import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import config from '../config/config.js';

/**
 * Admin login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Check credentials
    if (email !== config.admin.email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // For first time setup, allow plain password or hashed password
    let isValidPassword = false;
    
    // Check if password is hashed or plain
    if (config.admin.password.startsWith('$2a$') || config.admin.password.startsWith('$2b$')) {
      // Password is hashed
      isValidPassword = await bcrypt.compare(password, config.admin.password);
    } else {
      // Password is plain text (for development)
      isValidPassword = password === config.admin.password;
    }

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken({ email });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        email,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Verify token (check if user is authenticated)
 */
export const verifyToken = (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      email: req.user.email,
    },
  });
};
