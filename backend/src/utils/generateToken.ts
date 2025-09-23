import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { ApiError } from './ApiError.js';

interface JWTTokens {
  accessToken: string;
  refreshToken: string;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
}

export const generateJWTTokens = async (
  userId: mongoose.Types.ObjectId
): Promise<JWTTokens> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, 'User not found');
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as 'strict',
  };

  return { accessToken, refreshToken, cookieOptions };
};