const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect("mongodb+srv://stan:passwordhashed@firstcluster.xs0mkcb.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(console.log("Connected to database!"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:4200", credentials: true, preflightContinue: true }));
app.use("/images", express.static("images"));

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
