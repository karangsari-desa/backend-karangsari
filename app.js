import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

import router from './src/routes/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome to the API' });
});

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
