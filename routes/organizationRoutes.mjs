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
 
    if (q?.trim()) {
      const rx = new RegExp(q.trim(), "i");
      where.$or = [{ name: rx }, { letters: rx }];
    }
    
    if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
      return res.status(400).json({ error: "Invalid cursor" });
    }

    const lim = Math.min(Number(limit) || 20, 50);

    const query = { ...where };
    if (cursor) query._id = { $lt: cursor };

    const items = await Organization.find(query)
      .select("_id name letters crestUrl about establishedDate isActive createdAt")
      .sort({ _id: -1 })
      .limit(lim + 1) 
      .lean();

    const hasMore = items.length > lim;
    if (hasMore) items.pop(); 
    
    const nextCursor = hasMore && items.length ? items[items.length - 1]._id : null;
    
    res.json({ 
      items, 
      nextCursor,
      hasMore
    });
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



export default router;
