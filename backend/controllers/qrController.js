const qr = require("qrcode");
const UserService = require("../services/UserService");
const sendToken = require("../utils/jwtToken");

const userService = new UserService();

class QrController {
    constructor() {}

    getQrForm = (req, res) => {
        res.render("index");
    };

    generateQr = (req, res) => {
        const url = req.body.url;
        const type = req.body.type || "svg";
        const color = req.body.color || "#000";
        if (url.length === 0) {
            return res.redirect("/qr-service/create-qr");
        }
        var opts = {
            color: {
                dark: color,
                light: "#0000", // Transparent background
            },
        };
        var result = "";
        var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < charactersLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result += "." + type;

        const FilePath = "./public/generatedQR/" + result;
        const src = "/generatedQR/" + result;

        qr.toFile(FilePath, url, opts, function(err) {
            if (err) throw err;
            res.render("scan", { src });
        });
    };

    login = async(req, res) => {
        const { qrToken } = req.body;

        try {
            const user = await userService.checkQrToken(qrToken);
            if (user) {
                sendToken(user, 200, res);
            } else {
                res.status(404).json({ success: true });
            }
        } catch (error) {
            console.log(error.message);
            res.status(404).json({ success: false });
        }
    };
}

module.exports = QrController;