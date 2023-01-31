const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const user = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    newUser
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created successfully",
          user: result,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, "secret-key-this-should-be-longer", { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true });

      res.status(200).json({
        message: "User logged in successfully",
        fetchedUser,
        userId: fetchedUser._id,
        token,
        expiresIn: 3600,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
});

module.exports = router;
