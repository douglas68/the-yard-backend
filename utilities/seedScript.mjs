import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
// Collections/Models
import Organization from "../models/organizationSchema.mjs";
import User from "../models/userSchema.mjs";
import Post from "../models/postSchema.mjs";
// Data
import organizations from "./organizationData.mjs";
import users from "./signupData.mjs";
import posts from "./postData.mjs";

dotenv.config();

const connectionStr = process.env.MONGO_URI || "";

async function seedDatabase() {
  console.log(`✅ Seeding Script Run`);
  
  try {
    await mongoose.connect(connectionStr);
    console.log(`✅ Connected to DB...`);

    // === SEED ORGANIZATIONS ===
    await Organization.deleteMany();
    console.log(`✅ Cleared DB of prev organizations`);
    
    await Organization.create(organizations);
    console.log(`✅ Seeded DB with new organizations`);

    let orgs = await Organization.find({});
    console.log(`✅ Retrieved New Organization IDs from the DB`);

    // === SEED USERS ===
    // Map organizationName to organizationId
    for (let u of users) {
      for (let o of orgs) {
        if (u.organizationName === o.name) {
          u.organizationId = o._id;
          break;
        }
      }
      // Hash password
      u.passwordHash = await bcrypt.hash(u.password, 10);
      // Clean up email
      u.email = u.email.toLowerCase().trim();
      // Remove the password field (we have passwordHash now)
      delete u.password;
      // Remove organizationName (we have organizationId now)
      delete u.organizationName;
    }

    console.log(`✅ Mapped new users with new organizationIDs`);
    
    await User.deleteMany();
    console.log(`✅ Cleared DB of prev users`);
    
    await User.create(users);
    console.log(`✅ Seeded DB with users`);

    let userDocs = await User.find({});
    console.log(`✅ Retrieved New User IDs from the DB`);

    // === SEED POSTS ===
    // Map authorEmail to authorId and organizationName to organizationId
    for (let p of posts) {
      // Find author by email
      for (let u of userDocs) {
        if (p.authorEmail === u.email) {
          p.authorId = u._id;
          break;
        }
      }
      // Find organization by name
      for (let o of orgs) {
        if (p.organizationName === o.name) {
          p.organizationId = o._id;
          break;
        }
      }
      // Remove temporary fields
      delete p.authorEmail;
      delete p.organizationName;
    }

    console.log(`✅ Mapped new posts with new authorIDs and organizationIDs`);
    
    await Post.deleteMany();
    console.log(`✅ Cleared DB of prev posts`);
    
    await Post.create(posts);
    console.log(`✅ Seeded DB with posts`);

    console.log(`🎉 Seed Complete`);
    process.exit(0);
  } catch (err) {
    console.error(`❌ Error seeding DB`, err);
    process.exit(1);
  }
}

seedDatabase();