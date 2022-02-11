const User = require("../../models/userModel");
const NotAuthorizedError = require("../../utils/NotAuthorizedError");

class GoogleService {
    constructor() {}

    Login = async(payload) => {
        const { email, name } = payload;

        if (!email) throw NotAuthorizedError("invalid Email");

        const user = await User.findOne({ email });

        if (!user) {
            let password =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            user = await User.create({ email, name, emailVerified: true, password });
        }

        return user;
    };
}

module.exports = GoogleService;