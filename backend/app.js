const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect("mongodb+srv://stan:passwordhashed@firstcluster.xs0mkcb.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(console.log("Connected to database!"))
  .catch(console.log("Connection to database failed!"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/images", express.static(path.join("images"))); // path.join() takes the root folder-a and adds whatever path you pass as an argument
app.use("/images", express.static("images"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
