// routes/organizationRoutes.mjs
import { Router } from "express";
import mongoose from "mongoose";
import Organization from "../models/organizationSchema.mjs";

const router = Router();

// GET /api/organizations
router.get("/", async (req, res) => {
  try {
    const { active, q, limit = 20, cursor } = req.query;
    const where = {};
    if (active === "true") where.isActive = true;
    if (active === "false") where.isActive = false;
    if (q && q.trim()) {
      const rx = new RegExp(q.trim(), "i");
      where.$or = [{ name: rx }, { letters: rx }];
    }
    if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
      return res.status(400).json({ error: "Invalid cursor" });
    }

    const lim = Math.min(Number(limit) || 20, 50);
    const items = await Organization.find({
      ...where,
      ...(cursor ? { _id: { $lt: cursor } } : {}),
    })
      .select("_id name letters crestUrl about establishedDate isActive createdAt")
      .sort({ _id: -1 })
      .limit(lim)
      .lean();

    const nextCursor = items.length ? items[items.length - 1]._id : null;
    res.json({ items, nextCursor });
  } catch (err) {
    console.error("GET /organizations error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/organizations/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid organization id" });
    }
    const org = await Organization.findById(id)
      .select("_id name letters crestUrl about establishedDate isActive createdAt updatedAt")
      .lean();
    if (!org) return res.status(404).json({ error: "Organization not found" });
    res.json({ organization: org });
  } catch (err) {
    console.error("GET /organizations/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// (optional) PATCH /api/organizations/:id
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid organization id" });
    }
    const { about, crestUrl, isActive, establishedDate } = req.body;
    const update = {};
    if (typeof about === "string") update.about = about.trim();
    if (typeof crestUrl === "string") update.crestUrl = crestUrl.trim();
    if (typeof isActive === "boolean") update.isActive = isActive;
    if (establishedDate !== undefined) {
      const d = new Date(establishedDate);
      if (isNaN(d.getTime())) return res.status(400).json({ error: "Invalid establishedDate" });
      update.establishedDate = d;
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }
    const org = await Organization.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).select("_id name letters crestUrl about establishedDate isActive createdAt updatedAt");
    if (!org) return res.status(404).json({ error: "Organization not found" });
    res.json({ organization: org });
  } catch (err) {
    console.error("PATCH /organizations/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
