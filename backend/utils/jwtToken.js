// Creating token and saving in cookie

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    //   Option for cookies
    const options = {
        expires: new Date(
            Number(new Date()) + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "None",
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
    });
};

module.exports = sendToken;