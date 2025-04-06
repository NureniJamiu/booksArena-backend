import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import PartnershipRequest from "../models/PartnershipRequest.js";
import { sendNotification } from "../helpers/notification.js";

const router = express.Router();
// Route to find potential partners based on interests
router.get("/recommendations", protectRoute, async (req, res) => {
  const { userId } = req.body;

  try {
    // Get the user's interests from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const interests = user.readingInterests || ["general"]; // Default to 'general' if no interests are selected

    // Find users with similar interests
    const recommendedPartners = await User.find({
      readingInterests: { $in: interests },
      _id: { $ne: userId }, // Exclude the current user
    }).limit(20); // Limit to 20 recommended users

    res.status(200).json(recommendedPartners);
  } catch (error) {
    console.error("Error fetching recommended partners:", error);
    res.status(500).json({ message: "Error fetching partners" });
  }
});

// Search partners by username
router.get("/search", protectRoute, async (req, res) => {
  const { username } = req.query;

  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }); // Case-insensitive search
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found with that username" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Error searching for users" });
  }
});

// Send a partnership request
router.post("/request", protectRoute, async (req, res) => {
  const { partnerId } = req.body;
  const userId = req.userId; // Extract user ID from JWT token

  try {
    // Check if both users exist
    const user = await User.findById(userId);
    const partner = await User.findById(partnerId);

    if (!user || !partner) {
      return res.status(404).json({ message: "User or partner not found" });
    }

    // Create a partnership request document
    const partnershipRequest = new PartnershipRequest({
      from: userId,
      to: partnerId,
      status: "pending", // "pending" means request is waiting for partner's response
    });

    // Save the request
    await partnershipRequest.save();

    // Send a notification to the partner about the request (we'll handle this next)
    await sendNotification(partnerId, "You have a new partnership request!");

    res.status(200).json({ message: "Partnership request sent successfully" });
  } catch (error) {
    console.error("Error sending partnership request", error);
    res.status(500).json({ message: "Error sending request" });
  }
});

// accept/decline a partnership request
router.post("/respond", protectRoute, async (req, res) => {
  const { requestId, action } = req.body; // action: "accept" or "decline"
  const userId = req.userId; // User responding to the request

  try {
    // Find the partnership request
    const partnershipRequest = await PartnershipRequest.findById(requestId);

    if (!partnershipRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if the request is for this user (the recipient)
    if (partnershipRequest.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot respond to this request" });
    }

    // Update the request status based on the action (accept/decline)
    if (action === "accept") {
      partnershipRequest.status = "accepted";
      // Optionally, you can also add the users to a "partners" collection or create a new relationship document
    } else if (action === "decline") {
      partnershipRequest.status = "declined";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await partnershipRequest.save();

    res.status(200).json({ message: `Request ${action}ed successfully` });
  } catch (error) {
    console.error("Error responding to partnership request", error);
    res.status(500).json({ message: "Error responding to request" });
  }
});

export default router;
