const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authFullUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decodedData);
  const id = decodedData.id;
  const fullUser = await User.findById(id).select("-password");

  if (!fullUser) {
    return next(new ErrorHandler("User is not found", 404));
  }
  if (!fullUser.emailVerified) {
    return next(new ErrorHandler("Email is not verified", 401));
  }
  req.user = fullUser;

  next();
});

module.exports = { authFullUser };
