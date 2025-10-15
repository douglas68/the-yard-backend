import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/conn.mjs"
import cors from "cors";

//SETUPS
dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();

// DB CONNECTION
connectDB();

//MIDDLEWARE

//ROUTES

//GLOBAL ERR HANDLING

//LISTENER

app.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});