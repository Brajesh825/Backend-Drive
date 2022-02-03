const nodeMailer = require("nodemailer");
// const sendEmail = async(options) => {
//     const transporter = nodeMailer.createTransport({
//         service: process.env.SMPT_SERVICE,
//         host: process.env.SMTP_HOST,
//         auth: {
//             user: process.env.SMPT_MAIL,
//             pass: process.env.SMPT_PASSWORD,
//         },
//     });
//     const mailOptions = {
//         from: process.env.SMPT_MAIL,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//     };

//     await transporter.sendMail(mailOptions);
// };

const sendmail = require("sendmail")();

const sendEmail = async(options) => {
    await sendmail({
            from: process.env.SMPT_MAIL,
            to: options.email,
            subject: options.subject,
            html: "Mail of test sendmail ",
        },
        function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        }
    );
};

module.exports = sendEmail;