import express from "express";
import Article from "../models/Article.js";
import protectRoute from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

// Route to fetch all articles
router.get("/", protectRoute, async (req, res) => {
  const { userId } = req.body;

  try {
    // Get the user's interests from your database or from the request body
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user has selected interests, fetch articles for those
    const interests =
      user.readingInterests && user.readingInterests.length > 0
        ? user.readingInterests
        : ["general"]; // Default to 'general' if no interests are selected

    // Prepare a list to store all articles
    let articles = [];

    // Fetch articles for each interest category
    for (const interest of interests) {
      try {
        const response = await axios.get(`https://external-api.com/articles`, {
          params: { category: interest },
        });
        articles = [...articles, ...response.data]; // Assuming response.data is an array of articles
      } catch (error) {
        console.error(
          `Error fetching articles for ${interest}:`,
          error.message
        );
      }
    }

    // Return all the fetched articles (or a mixture if none are found)
    if (articles.length === 0) {
      return res
        .status(404)
        .json({ message: "No articles found for the selected interests" });
    }

    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles", error });
  }
});
// Route to fetch all articles shared by a user
router.get("/user/:userId", protectRoute, async (req, res) => {
  const { userId } = req.params;
  try {
    const articles = await Article.find({ sharedBy: userId });
    res.json(articles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to share an article
router.post("/share", protectRoute, async (req, res) => {
  const { originalUrl, title, source, sharedBy, sharedWith, partnerId } =
    req.body;

  try {
    const newArticle = new Article({
      originalUrl,
      title,
      source,
      sharedBy,
      sharedWith,
      partnerId,
    });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to mark an article as read
router.put("/read/:articleId", protectRoute, async (req, res) => {
  const { articleId } = req.params;
  try {
    const article = await Article.findByIdAndUpdate(
      articleId,
      { readStatus: true, readDate: new Date() },
      { new: true }
    );
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
