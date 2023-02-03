const express = require("express");
const multer = require("multer");

const extractFile = require("../config/multer");
const checkAuth = require("../middleware/check-auth");
const PostsController = require("../controllers/posts");

const router = express.Router();

router.get("", PostsController.getAllPosts);
router.get("/:postId", PostsController.getSinglePost);
router.post("", checkAuth, extractFile, PostsController.createPost);
router.put("/:postId", checkAuth, extractFile, PostsController.updatePost);
router.delete("/:postId", checkAuth, PostsController.deletePost);

module.exports = router;
