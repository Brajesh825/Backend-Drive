const express = require("express");

const QrController = require("../controllers/qrController.js");
const qrController = new QrController();

const router = express.Router();

router.route("/create-qr").get(qrController.getQrForm);
router.route("/create-qr").post(qrController.generateQr);

router.route("/login").post(qrController.login);

module.exports = router;