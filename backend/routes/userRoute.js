const express = require("express");

const {
  registerUser,
  verifyEmail,
  loginUser,
  logout,
  resendVerifyEmail,
  changePassword,
  getCurrentUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router
  .route("/resend-verify-email")
  .post(isAuthenticatedUser, resendVerifyEmail);
router.route("/change-password").patch(isAuthenticatedUser, changePassword);
router.route("/user").get(isAuthenticatedUser, getCurrentUser);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:token").get(resetPassword);

module.exports = router;
