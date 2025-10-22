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
      "_id fullName email organizationId role createdAt"
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
      "_id fullName email organizationId role about createdAt"
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

    const { fullName, email, organizationId, about } = req.body;

    const update = {};

    if (typeof fullName === "string" && fullName.trim()) {
      update.fullName = fullName.trim();
    }

    if (typeof email === "string" && email.trim()) {
      update.email = email.toLowerCase().trim();
    }

    if (typeof organizationId === "string") {
      if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        return res.status(400).json({ error: "Invalid organizationId" });
      }
      update.organizationId = organizationId;
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
    }).select(
      "_id fullName email organizationId role about createdAt updatedAt"
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (err) {
    // Handle duplicate email nicely
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error("PATCH /users/:id error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
