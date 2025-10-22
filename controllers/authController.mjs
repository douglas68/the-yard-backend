import User from "../models/userSchema.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || process.env.jwtSecret; // support either name

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, email, password, chapterId, role } = req.body;

    // already registered?
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      chapterId: chapterId || undefined,
      role: role || undefined,
    });

    const payload = { user: { id: user._id } };

    jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" }, (err, token) => {
      if (err) throw err;
      return res.status(201).json({ token });
    });
  } catch (err) {
    
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ errors: [{ msg: "Email already in use" }] });
    }
    console.error(err);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

export const getUserInfo = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ errors: [{ msg: "User not found" }] });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const payload = { user: { id: user._id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({ token });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

export default { registerUser, getUserInfo, loginUser };
