const express = require("express");
const multer = require("multer");

const storage = require("../config/multer");
const checkAuth = require("../middleware/check-auth");
const PostsController = require("../controllers/posts");

const router = express.Router();

router.get("", PostsController.getAllPosts);
router.get("/:postId", PostsController.getSinglePost);
router.post("", checkAuth, multer({ storage }).single("image"), PostsController.createPost);
router.put("/:postId", checkAuth, multer({ storage }).single("image"), PostsController.updatePost);
router.delete("/:postId", checkAuth, PostsController.deletePost);

module.exports = router;
