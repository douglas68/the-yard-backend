import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization", 
      required: false,
    },
    role: {
      type: String,
      enum: ["member", "officer", "alumni", "admin"],
      default: "member",
    },
  },
  { timestamps: true }
);


userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
