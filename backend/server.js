import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import authRoutes from "./routes/auth.js";
import progressRoutes from "./routes/progressRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});