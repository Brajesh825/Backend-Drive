const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const busboy = require("connect-busboy");
const errorMiddleware = require("./middleware/error");
const helmet = require("helmet");
const compression = require("compression");
const qr = require("qrcode");
const bp = require("body-parser");
const cors = require("cors");

// Middleware
app.use(cors());
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json({}));
app.use(helmet());
app.use(compression());

app.use(
    busboy({
        highWaterMark: 2 * 1024 * 1024,
    })
);

// Route imports
const user = require("./routes/userRoute");
const file = require("./routes/fileRoute");
const document = require("./routes/documentRoute");
const folder = require("./routes/folderRoute");

// Simple routing to the index.ejs file

var publicDir = require("path").join(__dirname, "..", "/public");
app.use(express.static(publicDir));

app.use("/user-service/", user);
app.use("/file-service/", file);
app.use("/documentation/", document);
app.use("/folder-service/", folder);

app.use(bp.urlencoded({ extended: false }));
app.get("/createQR", (req, res) => {
    res.render("index");
});
app.post("/createQR", (req, res) => {
    const url = req.body.url;
    const type = req.body.type || "svg";
    const color = req.body.color || "#000";
    if (url.length === 0) res.send("Empty Data!");
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

    const FilePath = "./public/images/" + result;
    src = "/images/" + result;

    qr.toFile(FilePath, url, opts, function(err) {
        if (err) throw err;
        res.render("scan", { src });
    });
});

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;