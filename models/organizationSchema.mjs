import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100, 
      unique: true,     
    },
    letters: {
      type: String,      
      trim: true,
      maxlength: 10,
    },
    crestUrl: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    establishedDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("organization", organizationSchema);