const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");

router.route("/verify").get((req, res, next) => {
    console.log("Hello");
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "tes27769@gmail.com",
            pass: "2778@tes",
        },
    });
    transporter.verify().then(console.log).catch(console.error);
});

module.exports = router;