import mongoose from "mongoose";

const partnershipRequestSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Sender (user requesting partnership)
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Receiver (user receiving partnership request)
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"], // Status of the partnership request
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp when the request was created
  },
  { timestamps: true }
);

const PartnershipRequest = mongoose.model(
  "PartnershipRequest",
  partnershipRequestSchema
);

export default PartnershipRequest;
