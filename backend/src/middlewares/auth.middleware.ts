import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Access Denied. No token provided.');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    const user = await User.findById((decoded as { id: string }).id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized: Invalid token.');
    }

    req.user = user;
    next();
  }
);

export { verifyJWT };
