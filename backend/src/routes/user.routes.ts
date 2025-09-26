import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getUser, upgradePlan } from '../controllers/user.controller.js';

const router: express.Router = express.Router();

router.use(verifyJWT);

router.route('/me').get(getUser);

router.route('/admin/upgrade-plan/:tenantId').get(upgradePlan);

export default router;