import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * Middleware to verify JWT token
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Generate JWT token
 */
export const generateToken = (user) => {
  return jwt.sign(
    { email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};
