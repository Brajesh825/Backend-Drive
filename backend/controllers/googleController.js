const { OAuth2Client } = require("google-auth-library");
const GoogleService = require("../services/GoogleService");
const sendToken = require("../utils/jwtToken");

const googleService = new GoogleService();
const CLIENT_ID = process.env.GOOGLE_LOGIN_CLIENT;
const client = new OAuth2Client(CLIENT_ID);

class GoogleController {
    constructor() {}

    Login = async(req, res) => {
        try {
            const { idToken } = req.body;

            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: CLIENT_ID,
            });

            const payload = ticket.getPayload();

            const user = await googleService.Login(payload);

            sendToken(user, 200, res);
        } catch (error) {
            console.log(error.message);
            const code = error.code || 500;
            res.status(code).send(error.message);
        }
    };
}

module.exports = GoogleController;