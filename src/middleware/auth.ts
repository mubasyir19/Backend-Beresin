import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface IDecode {
  id: string;
  fullname: string;
  bio: string;
  username: string;
  email: string;
  role: 'Admin' | 'Member' | 'Manager';
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: IDecode;
}

export const verifyAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized: no provided token',
      data: null,
    });
    return;
  }

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error('SECRET_KEY environment variable not set');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded as IDecode;
    next();
  });
};
