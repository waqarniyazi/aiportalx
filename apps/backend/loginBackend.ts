const bcrypt = require('bcryptjs') as any; // Use bcryptjs instead of bcrypt
const jwt = require('jsonwebtoken') as any; // Suppressing TypeScript error

import express, { Router, Request, Response } from 'express';
import mongoose, { Schema, Document, model } from 'mongoose';

const router = Router();

// Define a User schema
interface IUser extends Document {
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = model<IUser>('User', userSchema);

// Login route
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
