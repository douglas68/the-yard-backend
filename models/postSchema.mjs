import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    picture: {
      type: String,
      trim: true,
      default: "",
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);


postSchema.index({ createdAt: -1 });
postSchema.index({ organizationId: 1, createdAt: -1 });
postSchema.index({ authorId: 1, createdAt: -1 });


export default mongoose.model("Post", postSchema);