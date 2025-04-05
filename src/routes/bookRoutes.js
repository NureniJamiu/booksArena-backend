import express from "express";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

// create a new book
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;

    if (!title || !caption || !image || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // upload image to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      upload_preset: "book-review",
    });

    const imageUrl = cloudinaryResponse.secure_url;

    // create new book
    const book = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await book.save();

    res.status(201).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating book" });
  }
});

// get all books
router.get("/", protectRoute, async (res, req) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImg");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching books" });
  }
});

// get all books by logged in user
router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching books" });
  }
});

// delete a book
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "Book deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting book" });
  }
});

export default router;
