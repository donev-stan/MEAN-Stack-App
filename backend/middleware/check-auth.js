const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret-key-this-should-be-longer");

    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
