const Post = require("../models/post");

exports.getAllPosts = async (req, res, next) => {
  const pageSize = Number(req.query.pageSize);
  const currentPage = Number(req.query.currentPage);

  const postQuery = Post.find();

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  try {
    const documents = await postQuery.find();
    const documentsCount = documents.length;

    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents.map((post) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath,
        creatorId: post.creator,
      })),
      maxPosts: documentsCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Fetching posts failed!",
    });
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Fetching posts failed!",
    });
  }
};

exports.createPost = async (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}`;

  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId,
  });

  try {
    const createdPost = await newPost.save();

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Creating a post failed!",
    });
  }
};

exports.updatePost = async (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}`;

  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file ? `${url}/images/${req.file.filename}` : req.body.imagePath,
    creator: req.userData.userId,
  });

  try {
    const result = await Post.updateOne({ _id: req.params.postId, creator: req.userData.userId }, updatedPost);

    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: "Post updated successfully!",
      });
    } else {
      res.status(401).json({
        message: "You are not authorized!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't update post!",
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.postId, creator: req.userData.userId });

    if (result.deletedCount > 0) {
      res.status(200).json({
        message: "Post deleted successfully!",
      });
    } else {
      res.status(401).json({
        message: "You are not authorized!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Fetching posts failed!",
    });
  }
};
