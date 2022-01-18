const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// Register a user

const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });
  const emailToken = user.getEmailConfirmationToken();
  await user.save();

  const emailConfirmationUrl = `${req.protocol}://${req.get(
    "host"
  )}/user-service/verify-email/${emailToken}`;

  const message = `click here to confirm your registration with us:- \n\n ${emailConfirmationUrl} \n\n If you have not requested this email then ,Please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Registration with us`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

const verifyEmail = catchAsyncErrors(async (req, res, next) => {
  const emailConfirmationToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    emailConfirmationToken,
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Email confirmation Token is Invalid or has expired",
        400
      )
    );
  }
  user.emailConfirmationToken = null;
  user.emailVerified = true;
  await user.save();
  sendToken(user, 200, res);
});

const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

const resendVerifyEmail = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.user;
  console.log(_id);
  const user = await User.findById(_id);

  const emailToken = user.getEmailConfirmationToken();
  await user.save();

  const emailConfirmationUrl = `${req.protocol}://${req.get(
    "host"
  )}/user-service/verify-email/${emailToken}`;

  const message = `click here to confirm your registration with us:- \n\n ${emailConfirmationUrl} \n\n If you have not requested this email then ,Please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Registration with us`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Change Password
const changePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  if (newPassword != confirmPassword) {
    new ErrorHandler("Password does not match", 400);
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// Get Current user
const getCurrentUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Forget Password
const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/user-service/reset-password/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then ,Please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Node.js Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is Invalid or has expired", 400)
    );
  }
  if (req.body.password != req.body.confirmPassword) {
    new ErrorHandler("Password does not match", 400);
  }
  user.password = req.body.password;
  user.getResetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logout,
  resendVerifyEmail,
  changePassword,
  getCurrentUser,
  forgetPassword,
  resetPassword,
};
