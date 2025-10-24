import { Router } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/userSchema.mjs";

const router = Router();

//Register 
router.post("/", async (req, res) => {
  try {
    const { fullName, email, password, organizationId, role } = req.body;

    // Validation
    if (!fullName?.trim()) {
      return res.status(400).json({ error: "Full name is required" });
    }
    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    if (!organizationId) {
      return res.status(400).json({ error: "Organization ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({ error: "Invalid organization ID" });
    }

    // Make sure it is in the correct format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      organizationId,
      role: role || "member",
    });

    
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({ user: userResponse });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    console.error("POST /users error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET MY PROFILE
router.get("/me", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "userId query parameter required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const user = await User.findById(userId)
      .select("_id fullName email organizationId role createdAt updatedAt")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("GET /users/me error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//GET ID BY EMAIL
router.get("/find", async (req, res) => {
  try {

    const { email } = req.query;

    if (!email?.trim()) 
      return res.status(400).json({ error: "email is required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .select("_id fullName email");

    if (!user) 
      return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET USER BY ID 
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(id)
      .select("_id fullName email organizationId role createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("GET /users/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE PROFILE
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { fullName, email, organizationId } = req.body;
    const update = {};

    // Validate and build update object
    if (fullName !== undefined) {
      if (typeof fullName !== "string" || !fullName.trim()) {
        return res.status(400).json({ error: "Full name cannot be empty" });
      }
      update.fullName = fullName.trim();
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedEmail = email.trim();
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      update.email = trimmedEmail.toLowerCase();
    }

    if (organizationId !== undefined) {
      if (organizationId && !mongoose.Types.ObjectId.isValid(organizationId)) {
        return res.status(400).json({ error: "Invalid organization ID" });
      }
      update.organizationId = organizationId || null;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).select("_id fullName email organizationId role createdAt updatedAt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error("PATCH /users/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;