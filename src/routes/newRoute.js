import express from 'express';
const router = express.Router();

import { authHandler } from '../middleware/authHandler.js';
import upload from '../config/multer.js';

import {
  getAllNewsController,
  getNewsByIdController,
  createNewsController,
  updateNewsController,
  deleteNewsController,
} from '../controllers/newController.js';

router.get('/news', getAllNewsController);
router.get('/news/:id', getNewsByIdController);
router.post('/news', authHandler, upload.single('img'), createNewsController);
router.put(
  '/news/:id',
  authHandler,
  upload.single('img'),
  updateNewsController,
);
router.delete('/news/:id', authHandler, deleteNewsController);

export default router;
