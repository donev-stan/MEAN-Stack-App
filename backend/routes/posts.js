const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid MIME Type");
    if (isValid) error = null;

    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + ext);
  },
});

// All Document
router.get("", (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents,
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
        post,
      });
    } else {
      res.status(404).json({
        message: "Post not found!",
      });
    }
  });
});

// Create Document
router.post("", multer(storage).single("image"), (req, res, next) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  newPost.save().then((result) => {
    res.status(201).json({
      message: "Post created successfully!",
      postId: result._id,
    });
  });
});

// Update Document
router.put("/:postId", (req, res, next) => {
  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.updateOne({ _id: req.params.postId }, updatedPost).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post updated successfully!",
    });
  });
});

// Delete Document
router.delete("/:postId", (req, res, next) => {
  Post.deleteOne({ _id: req.params.postId }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted successfully!",
    });
  });
});

module.exports = router;
