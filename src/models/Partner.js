import mongoose from "mongoose";

const partnershipStreakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  streakCount: { type: Number, default: 0 },
  lastSharedAt: { type: Date, default: Date.now },
});

const PartnershipStreak = mongoose.model(
  "PartnershipStreak",
  partnershipStreakSchema
);
export default PartnershipStreak;
