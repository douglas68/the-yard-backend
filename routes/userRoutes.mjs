// GET /api/users/:id
// GET /api/users/me
// PATCH /api/users/:id — update profile (fullName, email, chapterID, about)

import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/userSchema.mjs";

const router = Router();

// GET PROFILE (by id)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await User.findById(id).select(
      "_id fullName email chapterID role createdAt"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ user });
  } catch (err) {
    console.error("GET /users/:id error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET MY PROFILE (no-auth demo: ?userId=...)
router.get("/me", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid or missing userId" });
    }

    const user = await User.findById(userId).select(
      "_id fullName email chapterID role about createdAt"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ user });
  } catch (err) {
    console.error("GET /users/me error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// UPDATE PROFILE
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const { fullName, email, chapterID, about } = req.body;

    const update = {};

    if (typeof fullName === "string" && fullName.trim()) {
      update.fullName = fullName.trim();
    }

    if (typeof email === "string" && email.trim()) {
      update.email = email.toLowerCase().trim();
    }

    if (typeof chapterID === "string") {
      if (!mongoose.Types.ObjectId.isValid(chapterID)) {
        return res.status(400).json({ error: "Invalid chapterID" });
      }
      update.chapterID = chapterID;
    }

    if (typeof about === "string") {
      update.about = about.trim();
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).select("_id fullName email chapterID role about createdAt updatedAt");

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (err) {
    // doublecheck for Duplicate email
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error("PATCH /users/:id error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
