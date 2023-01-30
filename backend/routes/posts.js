const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const storage = require("../config/multer");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// All Document
router.get("", (req, res, next) => {
  const pageSize = Number(req.query.pageSize);
  const currentPage = Number(req.query.currentPage);

  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .find()
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts.map((post) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          creatorId: post.creator,
        })),
        maxPosts: count,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error fetching posts!",
      });
    });
});

// Single Documents
router.get("/:postId", (req, res, next) => {
  Post.findById(req.params.postId).then((post) => {
    if (post) {
      res.status(200).json({
        message: "Post fetched successfully!",
        post: {
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          creatorId: post.creator,
        },
      });
    } else {
      res.status(404).json({
        message: "Post not found!",
      });
    }
  });
});

// Create Document
router.post("", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}`;

  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId,
  });

  newPost.save().then((createdPost) => {
    res.status(201).json({
      message: "Post created successfully!",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
        creator: createdPost.creator,
      },
    });
  });
});

// Update Document
router.put("/:postId", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}`;

  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file ? `${url}/images/${req.file.filename}` : req.body.imagePath,
    creator: req.userData.userId,
  });

  Post.updateOne({ _id: req.params.postId, creator: req.userData.userId }, updatedPost).then((result) => {
    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: "Post updated successfully!",
      });
    } else {
      res.status(401).json({
        message: "Not authorized!",
      });
    }
  });
});

// Delete Document
router.delete("/:postId", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.postId, creator: req.userData.userId }).then((result) => {
    if (result.deletedCount > 0) {
      res.status(200).json({
        message: "Post deleted successfully!",
      });
    } else {
      res.status(401).json({
        message: "Not authorized!",
      });
    }
  });
});

module.exports = router;
