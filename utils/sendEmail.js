require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Setup OAuth2 Client
const oauth2Client = new OAuth2(
    process.env.OAUTH2_CLIENT_ID,
    process.env.OAUTH2_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

// Get new access-token
oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH2_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();

// Create SMTP Transport
const getTransportConfig = () => {
    return {
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'sociedon@gmail.com', 
            clientId: process.env.OAUTH2_CLIENT_ID,
            clientSecret: process.env.OAUTH2_CLIENT_SECRET,
            refreshToken: process.env.OAUTH2_REFRESH_TOKEN,
            accessToken,
        },
        tls: {
            rejectUnauthorized: false
        }
    }
};

module.exports.sendOtpVerification = async (userEmail, otp) => {
    let transporter = nodemailer.createTransport(getTransportConfig());

    const response = await transporter.sendMail({
        from: 'sociedon@gmail.com',
        to: userEmail,
        subject: `${otp} is your Sociedon sign-up passcode`,
        html: `
            <h1 
            style="
                font-family: cursive; 
                font-size: 20px;
                padding: 8px;
                border-radius: 15px;
                background-color: #4849a1;
                color: #fff;
                width: 80%;
                text-align: center;
                letter-spacing: 1px;
            ">
                Sociedon
            </h1>
            <p style="font-family: Roboto; color: #6F6F6F; font-size: 16px;">Hi There,</p>
            <p style="font-family: Roboto; color: #6F6F6F; font-size: 16px;">Your one-time sign up passcode is:</p>
            <h2 style="font-family: Roboto;">${otp}</h2>
            <em>
                <p style="font-family: Roboto; color: #6F6F6F; font-size: 15px; letter-spacing: 1px;">
                    If you did not initiate the sign-up, please contact <strong>Sociedon Admin</strong> or report the issue to
                    <a>sociedon@gmail.com</a>
                </p>
            </em>
            <p style="font-family: Roboto; color: #6F6F6F;">Thank You,</p>
            <p style="font-family: cursive; letter-spacing: 1px; color: #6F6F6F;">Sociedon.</p>
        `,
        text: `
            <h1 
            style="
                font-family: cursive; 
                font-size: 20px;
                padding: 8px;
                border-radius: 15px;
                background-color: #4849a1;
                color: #fff;
                width: 80%;
                text-align: center;
                letter-spacing: 1px;
            ">
                Sociedon
            </h1>
            <p style="font-family: Roboto; color: #6F6F6F; font-size: 16px;">Hi There,</p>
            <p style="font-family: Roboto; color: #6F6F6F; font-size: 16px;">Your one-time sign up passcode is:</p>
            <h2 style="font-family: Roboto; font-size: 20px">${otp}</h2>
            <em>
                <p style="font-family: Roboto; color: #6F6F6F; font-size: 15px; letter-spacing: 1px;">
                    If you did not initiate the sign-up, please contact <strong>Sociedon Admin</strong> or report the issue to
                    <strong><a>sociedon@gmail.com</a></strong>
                </p>
            </em>
            <p style="font-family: Roboto; color: #6F6F6F;">Thank You,</p>
            <p style="font-family: cursive; letter-spacing: 1px; color: #6F6F6F;">Sociedon.</p>
        `
    });
    if(response) {
        return response;
    }
    else throw new Error("Couldn't send OTP, Please try again.");
} 


