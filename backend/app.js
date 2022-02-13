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
const google = require("./routes/googleRoute");
// Simple routing to the index.ejs file

var publicDir = require("path").join(__dirname, "..", "/public");
app.use(express.static(publicDir));

app.use("/google-service/", google);
app.use("/user-service/", user);
app.use("/file-service/", file);
app.use("/documentation/", document);
app.use("/folder-service/", folder);
app.use(bp.urlencoded({ extended: false }));
app.use("/qr-service/", qr);

// Testing

const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const session = require("cookie-session");

const GITHUB_CLIENT_ID = "10a1de853ae6844012e8";
const GITHUB_CLIENT_SECRET = "ab74625a5680d1734ddcb2cc59f3f17aa63ef778";
const GITHUB_SECRET = "agshdjdhjsdbjfjgvbjhbsfa";

app.use(
    session({
        secret: GITHUB_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
    cb(null, id);
});

passport.use(
    new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback",
        },
        function(accessToken, refreshToken, profile, cb) {
            cb(null, profile);
        }
    )
);

app.get("/", (req, res) => {
    if (!req.user) {
        return res.sendFile(__dirname + "/dashboard.html");
    }
    const id = req.user;

    res.json({ id });
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

//auth
app.get("/auth/github", passport.authenticate("github"));

app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/");
    }
);

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;