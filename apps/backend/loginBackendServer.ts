import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import loginBackendRoutes from './LoginBackend';

dotenv.config();

const loginApp = express();
const LOGIN_BACKEND_PORT = process.env.LOGIN_BACKEND_PORT || 5001;

loginApp.use(cors({ origin: process.env.CLIENT_URL }));
loginApp.use(express.json());

// Connect to MongoDB (reuse connection for simplicity)
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('✅ Connected to MongoDB for LoginBackend'))
  .catch((err) => {
    console.error('❌ MongoDB connection error for LoginBackend:', err);
    process.exit(1);
  });

// Routes for LoginBackend
loginApp.use('/api/login', loginBackendRoutes);

// Start the LoginBackend server
loginApp.listen(LOGIN_BACKEND_PORT, () => {
  console.log(`✅ Login Backend running on http://localhost:${LOGIN_BACKEND_PORT}`);
});
