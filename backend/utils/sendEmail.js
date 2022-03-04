const nodemailer = require("nodemailer");

const { google } = require("googleapis");

// ENV VARS
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const SMTP_MAIL = process.env.SMTP_MAIL;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
});

const sendEmail = async(options) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        console.log(REFRESH_TOKEN);

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "tes27769@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: SMTP_MAIL,
            to: options.email,
            subject: options.subject,
            text: "options.message",
            html: `<h2>${options.message}</h2>`,
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;