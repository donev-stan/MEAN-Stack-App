const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose
  .connect("mongodb+srv://stan:passwordhashed@firstcluster.xs0mkcb.mongodb.net/?retryWrites=true&w=majority")
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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");

  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  console.log(post);

  res.status(201).json({
    message: "Post created successfully!",
    post,
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: 1,
      title: "Post 1",
      content: "First post content bla",
    },
    {
      id: 2,
      title: "Post 2",
      content: "Second post content bla",
    },
  ];

  res.status(200).json({
    message: "Post fetched successfully!",
    posts,
  });
});

module.exports = app;
