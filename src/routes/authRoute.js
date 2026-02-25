import express from 'express';
const router = express.Router();

import { authHandler } from '../middleware/authHandler.js';

import {
  postUserController,
  postAuthController,
  putAuthController,
  deleteAuthController,
  changePasswordController,
  userLoggedInController,
} from '../controllers/authController.js';

router.post('/auth/create-user', authHandler, postUserController);
router.post('/auth', postAuthController);
router.put('/auth', putAuthController);
router.delete('/auth', deleteAuthController);
router.put('/auth/change-password', authHandler, changePasswordController);
router.get('/auth/logged-in', authHandler, userLoggedInController);

export default router;
