const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Please login to access this resource");
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedData.id).select("-password");

    if (!user) throw new Error("No User");

    if (!user.emailVerified) throw new Error("Email Not Verified");

    req.user = user;

    next();
  } catch (e) {
    if (
      e.message !== "No Access Token" &&
      e.message !== "No User" &&
      e.message !== "Email Not Verified"
    )
      console.log("\nAuthorization Middleware Error:", e.message);

    res.status(401).send("Error Authenticating");
  }
};

module.exports = auth;
