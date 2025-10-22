import { Router } from "express";
import mongoose from "mongoose";
import Chapter from "../models/chapterSchema.mjs";

const router = Router();

//get chapters
router.get("/", async (req, res) => {
  try {
    const { organization, active, q, limit = 20, cursor } = req.query;

    const where = {};
    if (organization) where.organization = organization.trim();
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

    const items = await Chapter.find({
      ...where,
      ...(cursor ? { _id: { $lt: cursor } } : {}),
    })
      .select("_id name letters organization crestUrl about establishedDate isActive createdAt")
      .sort({ _id: -1 })
      .limit(lim)
      .lean();

    const nextCursor = items.length ? items[items.length - 1]._id : null;

    return res.json({ items, nextCursor });
  } catch (err) {
    console.error("GET /chapters error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// get chapter by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid chapter id" });
    }

    const chapter = await Chapter.findById(id)
      .select("_id name letters organization crestUrl about establishedDate isActive createdAt updatedAt")
      .lean();

    if (!chapter) return res.status(404).json({ error: "Chapter not found" });

    return res.json({ chapter });
  } catch (err) {
    console.error("GET /chapters/:id error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});


export default router;
