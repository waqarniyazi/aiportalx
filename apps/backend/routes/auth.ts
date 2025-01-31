import { Request, Response } from "express";
import { User } from "./user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secret = "your-secure-secret";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const signupUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, dateOfBirth } = req.body;

  console.log("Request body:", req.body); // Debug log

  try {
    if (!name || !email || !password || !dateOfBirth) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const parsedDateOfBirth = new Date(dateOfBirth);
    if (isNaN(parsedDateOfBirth.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth: parsedDateOfBirth,
    });

    await user.save();
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });

    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
