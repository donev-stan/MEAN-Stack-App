const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");

  next();
});

app.post("/api/posts", (req, res, next) => {
  const posts = req.body;
  console.log(posts);

  res.status(201).json({
    message: "Post created successfully!",
    posts,
  });
});

app.use("/api/posts", (req, res, next) => {
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
