const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const busboy = require("connect-busboy");
const errorMiddleware = require("./middleware/error");
const helmet = require("helmet");
const compression = require("compression");
const bp = require("body-parser");
const cors = require("cors");

// Middleware
app.use(cors());
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json({}));
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
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
const qr = require("./routes/qrRoute");
// Simple routing to the index.ejs file

var publicDir = require("path").join(__dirname, "..", "/public");
app.use(express.static(publicDir));

app.use("/user-service/", user);
app.use("/file-service/", file);
app.use("/documentation/", document);
app.use("/folder-service/", folder);
app.use(bp.urlencoded({ extended: false }));
app.use("/qr-service/", qr);

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;