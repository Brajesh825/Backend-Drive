const express = require("express");
const auth = require("../middleware/auth");

const UserController = require("../controllers/userController");

const userController = new UserController();

const router = express.Router();

router.route("/register").post(userController.registerUser);
router.route("/verify-email/:token").get(userController.verifyEmail);
router.route("/login").post(userController.loginUser);
router.route("/logout").get(userController.logout);
router
  .route("/resend-verify-email")
  .post(auth, userController.resendVerifyEmail);
router.route("/change-password").patch(auth, userController.changePassword);
router.route("/user").get(auth, userController.getCurrentUser);
router.route("/forget-password").post(userController.forgetPassword);
router.route("/reset-password/:token").get(userController.resetPassword);

module.exports = router;
