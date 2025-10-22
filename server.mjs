import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/conn.mjs";
import { log, notFound, globalErr } from "./middleware/middleware.mjs";
import organizationRoutes from "./routes/organizationRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import postRoutes from "./routes/postRoutes.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(cors());
app.use(express.json());
app.use(log);

//Routes
app.use("/api/users", userRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/posts", postRoutes);

// Error Handling (AFTER routes)
app.use(notFound);
app.use(globalErr);

// Connect to DB THEN start server (only ONE app.listen)
connectDB();

//listener
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


// shutdown
process.on("SIGINT", async () => {
  console.log("\n👋 Shutting down...");
  process.exit(0);
});