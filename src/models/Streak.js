import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  dates: [
    {
      type: Date,
    },
  ],
  currentCount: {
    type: Number,
    default: 0,
  },
  longestCount: {
    type: Number,
    default: 0,
  },
  brokenCount: {
    type: Number,
    default: 0,
  },
});

const Streak = mongoose.model("Streak", streakSchema);
export default Streak;
