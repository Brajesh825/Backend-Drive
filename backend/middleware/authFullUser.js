const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authFullUser = async(req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];

        if (!bearerHeader) throw new Error("Authorization header is empty");

        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        const token = bearerToken;

        if (!token) {
            throw new Error("Please login to access this resource", 401);
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedData.id;
        const fullUser = await User.findById(id).select("-password");

        if (!fullUser) throw new Error("No User");

        if (process.env.EMAIL_VERIFIED === "True") {
            if (!fullUser.emailVerified) throw new Error("Email Not Verified");
        }

        req.user = fullUser;

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

module.exports = { authFullUser };