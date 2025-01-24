import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import imageRoutes from './src/routes/image.routes';
import { errorHandler } from './src/middlewares/error.middleware';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/images', imageRoutes);

// Error handling
app.use(errorHandler);

export default app;
