// Creating token and saving in cookie

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    //   Option for cookies
    const options = {
        expires: new Date(
            Number(new Date()) + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        type: "bearer",
    };

    res.status(200).send({
        success: true,
        token_type: "Bearer",
        scope: "customScope",
        expires_in: Number(options.expires),
        token_type: "Bearer",
        access_token: token,
    });
};

module.exports = sendToken;