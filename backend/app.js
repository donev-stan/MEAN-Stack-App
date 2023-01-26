const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose
  .connect("mongodb+srv://stan:passwordhashed@firstcluster.xs0mkcb.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection to database failed!");
  });

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  console.log(post);
  post.save().then((result) => {
    console.log(result);

    res.status(201).json({
      message: "Post created successfully!",
      postId: result._id,
    });
  });
});

app.get("/api/posts/:postId", (req, res, next) => {
  console.log(req.params.postId);
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

app.get("/api/posts", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
    });
  });
});

app.delete("/api/posts/:postId", (req, res, next) => {
  // Post.findByIdAndRemove(req.params.postId).then(() => {
  //   res.status(200).json({
  //     message: "Post deleted successfully!",
  //   });

  Post.deleteOne({ _id: req.params.postId }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted successfully!",
    });
  });
});

app.put("/api/posts/:postId", (req, res, next) => {
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
module.exports = app;
