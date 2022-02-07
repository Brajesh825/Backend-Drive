const User = require("./../../models/userModel");

class UserService {
    constructor() {}

    checkQrToken = async(qrLoginToken) => {
        const user = await User.findOne({ qrLoginToken });
        return user;
    };
}

module.exports = UserService;