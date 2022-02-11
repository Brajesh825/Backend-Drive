const express = require("express");

const GoogleController = require("../controllers/googleController.js");
const googleController = new GoogleController();

const router = express.Router();

router.route("/login").post(googleController.Login);

module.exports = router;