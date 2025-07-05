import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  // console.log('🛡️ Incoming authHeader:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No token provided or malformed header');
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log('✅ Token decoded:');

    if ((decoded as any).role !== 'admin') {
      console.log('⛔ Forbidden — not admin');
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next(); // ✅ continue to route
  } catch (err) {
    console.log('❌ Invalid token:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
