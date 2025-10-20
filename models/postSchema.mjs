
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },

    chapterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

 

    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// I would love to add comments

PostSchema.index({ createdAt: -1 });
PostSchema.index({ chapterID: 1, createdAt: -1 });

export default mongoose.model("Post", PostSchema);
