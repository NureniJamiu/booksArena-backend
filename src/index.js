import express from "express";
import dotenv from "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import connectDB from "./lib/db.js";
import job from "./lib/cron.js";

const app = express();
const port = process.env.PORT || 3000;

job.start();
app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/api/books", bookRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/streaks", streakRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});

export default app;
