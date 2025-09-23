import express from 'express';
import { registerUser, loginUser, logoutUser, refreshAccessToken } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router: express.Router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/refresh-token').post(verifyJWT, refreshAccessToken);

router.route('/logout').post(verifyJWT, logoutUser);

export default router;