import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = 5001;

mongoose
  .connect(
    "mongodb+srv://waqarniyazi:alliswell@cluster0.zrrzs.mongodb.net/User",
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
