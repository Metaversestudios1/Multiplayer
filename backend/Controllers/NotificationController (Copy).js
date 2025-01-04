const User = require("../Models/User");

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

const sendEmailNotification = async (req, res) => {
  try {
    console.log("send notification");
    console.log("data:", req.body);
    console.log("Received user_id:", req.body.user_id);
    let message = req.body.message;
    let type = req.body.type;
    let isGlobal = req.body.isGlobal;

    if (isGlobal) {
      const user_id = req.body.user_id;
      const user_details = await User.findOne({ _id: user_id });
      console.log("user_details:", user_details);
      const user_email = user_details.email;

      // Create transporter for sending email
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Check if email is present and send OTP via email
      if (user_email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user_email,
          subject: `${type}`,
          text: `Your message is ${message}`,
        });
        console.log(`Message sent to email: ${user_email}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendEmailNotification,
};
