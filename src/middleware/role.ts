import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './auth';

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: user not found in request' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: you do not have access to this resource' });
      return;
    }

    next();
  };
};
