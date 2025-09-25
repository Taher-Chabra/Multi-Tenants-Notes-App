import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { Tenant } from '../models/tenant.model.js';

// get user

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const user = await User.findById(userId).populate({
    path: 'tenantId',
    select: 'name',
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, 'User retrieved successfully'));
});

// upgrade plan (admin only)

const upgradePlan = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }
  const queryTenantId = req.params.tenantId;
  if (queryTenantId && queryTenantId !== req.user?.tenantId?.toString()) {
    throw new ApiError(403, 'Forbidden: Cannot upgrade plan for another tenant');
  }
  
  const tenantId = req.user?.tenantId;
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) {
    throw new ApiError(404, 'Tenant not found');
  }

  if (tenant.plan === 'pro') {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, `${tenant.name} is already on the pro plan`)
      );
  }

  tenant.plan = 'pro';
  await tenant.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { plan: tenant.plan },
        'Plan upgraded to pro successfully'
      )
    );
});

export { getUser, upgradePlan };
