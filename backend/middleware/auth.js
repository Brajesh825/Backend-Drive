const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async(req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];

        if (!bearerHeader) throw new Error("Authorization header is empty");

        // console.log(bearerHeader);

        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        const token = bearerToken;

        if (!token) {
            throw new Error("Please login to access this resource");
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedData.id).select("-password");

        if (!user) throw new Error("No User");

        if (process.env.EMAIL_VERIFIED === "True") {
            if (!user.emailVerified) throw new Error("Email Not Verified");
        }

        req.user = user;

        next();
    } catch (e) {
        if (
            e.message !== "No Access Token" &&
            e.message !== "No User" &&
            e.message !== "Email Not Verified"
        )
            console.log("\nAuthorization Middleware Error:", e.message);

        res.status(401).send("Error Authenticating");
    }
};

module.exports = auth;