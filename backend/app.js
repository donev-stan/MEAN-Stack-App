const express = require("express");

const app = express();

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
