import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/conn.mjs"
import cors from "cors";
import chaptersRoutes from "./routes/chapterRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";


//SETUPS
dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();

// DB CONNECTION
connectDB();

//MIDDLEWARE

//ROUTES
app.use(express.json());
app.use("/api/users", usersRoutes);
app.use("/api/chapters", chaptersRoutes);

//GLOBAL ERR HANDLING

//LISTENER

app.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});