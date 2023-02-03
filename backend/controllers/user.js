const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();

    if (createdUser) {
      const token = jwt.sign({ email: createdUser.email, userId: createdUser._id }, "secret-key-this-should-be-longer", { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true });

      res.status(200).json({
        message: "User created and logged in successfully!",
        userId: createdUser._id,
        expiresIn: 3600,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

exports.login = (req, res, next) => {
  let fetchedUser;

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "User not found!",
        });
      }

      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
        });
      }

      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, "secret-key-this-should-be-longer", { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true });

      res.status(200).json({
        message: "User logged in successfully",
        userId: fetchedUser._id,
        expiresIn: 3600,
        token,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Invalid authentication credentials!",
      });
    });
};

exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully!" });
};
