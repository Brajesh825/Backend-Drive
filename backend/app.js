const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const busboy = require("connect-busboy");
const errorMiddleware = require("./middleware/error");

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(
  busboy({
    highWaterMark: 2 * 1024 * 1024,
  })
);

// Route imports
const user = require("./routes/userRoute");
const file = require("./routes/fileRoute");
const document = require("./routes/documentRoute");

app.get("/", (req, res) => {
  res.json("Drive API");
});

app.use("/user-service/", user);
app.use("/file-service/", file);
app.use("/documentation/", document);

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;
