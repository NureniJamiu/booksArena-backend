import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  source: {
    type: String,
  },
  shareDate: {
    type: Date,
    default: Date.now,
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  readStatus: {
    type: Boolean,
    default: false,
  },
  readDate: {
    type: Date,
  },
});

const Article = mongoose.model("Article", articleSchema);
export default Article;
