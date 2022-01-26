const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const busboy = require("connect-busboy");
const errorMiddleware = require("./middleware/error");
const helmet = require("helmet");
const compression = require("compression");

// Middleware
app.use(cookieParser());
app.use(express.json());

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

app.use("/user-service/", user);
app.use("/file-service/", file);
app.use("/documentation/", document);
app.use("/folder-service", folder);

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;
