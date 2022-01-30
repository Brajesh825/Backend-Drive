const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const busboy = require("connect-busboy");
const errorMiddleware = require("./middleware/error");
const helmet = require("helmet");
const compression = require("compression");
const qr = require("qr-image");

// Middleware
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
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

app.get("/", (req, res) => {
    res.json({
        "Drive API": {
            "View Documentation": "/documentation/view",
        },
    });
});

app.get("/createQRCode", (req, res) => {
    var text = req.query.text || "";
    try {
        var img = qr.image(text, { size: 10 });
        res.writeHead(200, { "Content-Type": "image/png" });
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, { "Content-Type": "text/html" });
        res.end("<h1>414 Request-URI Too Large</h1>");
    }
});

app.use("/user-service/", user);
app.use("/file-service/", file);
app.use("/documentation/", document);
app.use("/folder-service/", folder);

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;