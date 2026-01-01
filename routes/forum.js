const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const Comment = require("../models/Comment");
const auth = require("../middleware/authMiddleware");

/* ===== Get All Posts ===== */
router.get("/posts", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find()
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 });

    const formatted = posts.map((post) => ({
      _id: post._id,
      author: {
        _id: post.author._id,
        username: post.author.username,
        profileImage: post.author.profileImage,
      },
      content: post.content,
      likes: post.likes.length,
      likedByUser: post.likes.includes(userId),
      saved: post.savedBy.includes(userId),
      comments: post.commentsCount,
      createdAt: post.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

/* ===== Create Post ===== */
router.post("/posts", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Content required" });
    }

    const post = await Post.create({
      author: req.user.id,
      content,
    });

    const populatedPost = await post.populate(
      "author",
      "username profileImage"
    );

    res.status(201).json({
      _id: populatedPost._id,
      author: {
        _id: populatedPost.author._id,
        username: populatedPost.author.username,
        profileImage: populatedPost.author.profileImage,
      },
      content: populatedPost.content,
      likes: 0,
      likedByUser: false,
      saved: false,
      comments: 0,
      createdAt: populatedPost.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create posts" });
  }
});

/* ===== Like/Unlike Post ===== */
router.post("/posts/:id/like", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      likes: post.likes.length,
      likedByUser: !liked,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to like post" });
  }
});

/* ===== Save/Unsave Post ===== */
router.post("/posts/:id/save", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const saved = post.savedBy.includes(userId);

    if (saved) {
      post.savedBy.pull(userId);
    } else {
      post.savedBy.push(userId);
    }

    await post.save();

    res.json({
      saved: !saved,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to save post" });
  }
});

/* ===== Get Comments by Post ===== */
router.get("/posts/:id/comments", auth, async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate("author", "username, profileImage")
      .sort({ createdAt: 1 });

    const formatted = comments.map((c) => ({
      id: c._id,
      author: c.author.username,
      avatar: c.author.profileImage,
      content: c.content,
      likes: c.likes.length,
      timestamp: c.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

/* ===== Add Comment ===== */
router.post("/posts/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Comment required" });
    }

    const comment = await Comment.create({
      postId: req.params.id,
      author: req.user.id,
      content,
    });

    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { commentsCount: 1 },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
});

/* ===== Delete Comment ===== */
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Comment.deleteMany({ postId: post._id });
    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
