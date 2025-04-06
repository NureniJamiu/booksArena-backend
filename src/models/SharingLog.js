import mongoose from "mongoose";

const sharingLogSchema = new mongoose.Schema({
  // External article ID
  externalArticleId: { type: String, required: true }, // Assuming the external API returns a unique string ID for each article
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedAt: { type: Date, default: Date.now },
});

const SharingLog = mongoose.model("SharingLog", sharingLogSchema);
export default SharingLog;
