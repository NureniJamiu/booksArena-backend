import express from "express";
import Streak from "../models/Streak.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();
// Route to get streak data for a partner
router.get("/:partnerId", protectRoute, async (req, res) => {
  const { partnerId } = req.params;
  try {
    const streak = await Streak.findOne({ partnerId });
    res.json(streak);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to update streak count
router.put("/increment/:partnerId", protectRoute, async (req, res) => {
  const { partnerId } = req.params;
  try {
    const streak = await Streak.findOne({ partnerId });
    streak.currentCount += 1;
    streak.dates.push(new Date());
    if (streak.currentCount > streak.longestCount) {
      streak.longestCount = streak.currentCount;
    }
    await streak.save();
    res.json(streak);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
