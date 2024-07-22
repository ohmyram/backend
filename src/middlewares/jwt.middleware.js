import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.js';

export const validateJWT = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log('Unauthorized: Missing or invalid token');
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      console.log('Unauthorized: Missing token');
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        if (err instanceof jwt.TokenExpiredError) {
          console.log('Unauthorized: Token expired');
          return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }
        console.log('Unauthorized: Invalid token');
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      // Log decoded user for debugging
      console.log('Decoded user from token:', decoded);

      // Assign decoded user to req.user for use in subsequent middleware or routes
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error in token validation:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
