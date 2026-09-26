import jwt from 'jsonwebtoken';
import { dataStore } from '../services/store.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_exam_preparation_tracker_jwt_token_2026_xyz987'
      );

      const user = await dataStore.findUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found with this token' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no authorization token provided' });
  }
};
