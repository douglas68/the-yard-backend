import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionStr = process.env.MONGO_URI;

async function connectDB() {
  try {
    if (!connectionStr) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    
    await mongoose.connect(connectionStr);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
}

export default connectDB;