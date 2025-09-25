import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { Tenant } from '../models/tenant.model.js';
import { Request, Response } from 'express';
import { generateJWTTokens } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// Register a new user

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (
    [username, email, password].some(
      (field) => field === '' || field === undefined
    )
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(400, 'User with this credentials already exists');
  }

  const corp = email.split('@')[1].split('.');
  const tenantCorp = corp[corp.length - 2]; // Extract tenant corp name from email
  const tenant = await Tenant.findOne({ slug: tenantCorp });
  if (!tenant) {
    throw new ApiError(400, 'Email not associated with any tenant');
  }

  const newUser = await User.create({
    username,
    email,
    password,
    tenantId: tenant._id,
  });

  if (!newUser) {
    throw new ApiError(500, 'Failed to create user');
  }

  const { accessToken, refreshToken, cookieOptions } = await generateJWTTokens(
    newUser._id
  );

  return res
    .status(201)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(201, {}, 'User registered successfully')
    );
});

// Login user

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const user = await User.findOne({ email })
    .populate({ path: 'tenantId', select: 'name' });

  if (!user) {
    throw new ApiError(400, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(400, 'Invalid email or password');
  }

  const { accessToken, refreshToken, cookieOptions } = await generateJWTTokens(
    user._id
  );

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user }, 'Login successful'));
});

// refresh token

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Unauthorized: No refresh token provided');
  }

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as { id: string };

  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new ApiError(401, 'Unauthorized: Invalid refresh token');
  }
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Unauthorized: Refresh token mismatch');
  }

  const {
    accessToken,
    refreshToken: newRefreshToken,
    cookieOptions,
  } = await generateJWTTokens(user._id);

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed successfully')
    );
});

// Logout user

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  await User.findByIdAndUpdate(
    user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as 'strict',
  };

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'Logout successful'));
});

export { registerUser, loginUser, refreshAccessToken, logoutUser };
