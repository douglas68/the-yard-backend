
import { Router } from "express";
import mongoose from "mongoose";
import Post from "../models/Post.mjs";

const router = Router();

/**
 * GET /api/posts
 * List posts (newest first)
 * Query: ?organizationId=&authorId=&limit=20&cursor=<ObjectId>
 */
router.get("/", async (req, res) => {
  try {
    const { organizationId, authorId, limit = 20, cursor } = req.query;

    const where = {};
    if (organizationId) {
      if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        return res.status(400).json({ error: "Invalid organizationId" });
      }
      where.organizationId = organizationId;
    }
    if (authorId) {
      if (!mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(400).json({ error: "Invalid authorId" });
      }
      where.authorId = authorId;
    }
    if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
      return res.status(400).json({ error: "Invalid cursor" });
    }

    const lim = Math.min(Number(limit) || 20, 50);

    const items = await Post.find({
      ...where,
      ...(cursor ? { _id: { $lt: cursor } } : {}),
    })
      .sort({ _id: -1 })
      .limit(lim)
      .lean();

    const nextCursor = items.length ? items[items.length - 1]._id : null;
    return res.json({ items, nextCursor });
  } catch (err) {
    console.error("GET /posts error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/posts/:id
 * Read a single post
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    const post = await Post.findById(id).lean();
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.json({ post });
  } catch (err) {
    console.error("GET /posts/:id error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/posts
 * Create a post
 * Body: { text, picture?, authorId, organizationId }
 */
router.post("/", async (req, res) => {
  try {
    const { text, picture, authorId, organizationId } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }
    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: "Invalid authorId" });
    }
    if (!organizationId || !mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({ error: "Invalid organizationId" });
    }

    const post = await Post.create({
      text: text.trim(),
      picture: typeof picture === "string" ? picture.trim() : "",
      authorId,
      organizationId,
    });

    return res.status(201).json({ post });
  } catch (err) {
    console.error("POST /posts error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * PATCH /api/posts/:id
 * Update a post (demo guard: require matching authorId)
 * Body: { text?, picture?, authorId }
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, picture, authorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: "Invalid or missing authorId" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Demo guard: only author can edit
    if (String(post.authorId) !== String(authorId)) {
      return res.status(403).json({ error: "Not allowed to edit this post" });
    }

    const update = {};
    if (typeof text === "string") update.text = text.trim();
    if (typeof picture === "string") update.picture = picture.trim();

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updated = await Post.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    return res.json({ post: updated });
  } catch (err) {
    console.error("PATCH /posts/:id error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /api/posts/:id
 * Delete a post (demo guard: require matching authorId)
 * Query or Body: authorId
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.query.authorId || req.body.authorId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: "Invalid or missing authorId" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (String(post.authorId) !== String(authorId)) {
      return res.status(403).json({ error: "Not allowed to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    return res.status(204).send();
  } catch (err) {
    console.error("DELETE /posts/:id error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * (Optional) Like / Unlike
 * POST /api/posts/:id/like    { userId }
 * DELETE /api/posts/:id/like  { userId }
 */
router.post("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { likeCount: 1 } },
      { new: true }
    ).lean();
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.json({ likeCount: post.likeCount });
  } catch (err) {
    console.error("POST /posts/:id/like error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { likeCount: -1 } },
      { new: true }
    ).lean();
    if (!post) return res.status(404).json({ error: "Post not found" });
    // prevent negative numbers
    if (post.likeCount < 0) {
      await Post.findByIdAndUpdate(id, { likeCount: 0 });
      return res.json({ likeCount: 0 });
    }
    return res.json({ likeCount: post.likeCount });
  } catch (err) {
    console.error("DELETE /posts/:id/like error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
