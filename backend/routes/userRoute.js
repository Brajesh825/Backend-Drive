const express = require("express");
const auth = require("../middleware/auth");

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

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/resend-verify-email").post(auth, resendVerifyEmail);
router.route("/change-password").patch(auth, changePassword);
router.route("/user").get(auth, getCurrentUser);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:token").get(resetPassword);

module.exports = router;
