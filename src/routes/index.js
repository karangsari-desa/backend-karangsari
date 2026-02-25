import express from 'express';
const router = express.Router();

import authRoute from './authRoute.js';
import newRoute from './newRoute.js';

router.use('/api', newRoute);

router.use('/api', authRoute);

export default router;
