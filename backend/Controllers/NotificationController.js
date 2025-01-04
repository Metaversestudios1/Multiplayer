const User = require("../Models/User");
const nodemailer = require("nodemailer");
const Notification = require("../Models/Notification");

const sendEmailNotification = async (req, res) => {
  try {
    const { message, type, isGlobal, user_id } = req.body;
    //console.log("data", req.body);
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

    let recipients = [];
    // Ensure that isGlobal is a boolean
    const isGlobalBool =
      typeof isGlobal === "boolean" ? isGlobal : JSON.parse(isGlobal);

    if (isGlobalBool) {
      // Fetch all users for global notification
      const users = await User.find();
      if (!users || users.length === 0) {
        return res
          .status(404)
          .json({ message: "No users found in the database." });
      }

      // Send email to each user
      for (const user of users) {
        if (user.email) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `${type}`,
            text: `Your message is: ${message}`,
          });
          console.log(`Message sent to email: ${user.email}`);
          recipients.push(user.email); // Store user email in recipients for global notifications
        }
      }

      //   for (const user of users) {
      //     if (user.email) {
      //       recipients.push(user.email); // Store user email in recipients for global notifications
      //     }
      //   }

      // Save notification in the database
      await Notification.create({
        message,
        type,
        isGlobal,
        recipients,
      });

      return res.status(200).json({
        success: true,
        message: "Global notification sent to all users.",
      });
    } else {
      // Logic for sending notification to a specific user
      //console.log("Send email ti single user");
      if (!user_id) {
        return res.status(400).json({
          message: "User ID is required for non-global notifications.",
        });
      }

      const user = await User.findOne({ _id: user_id });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (user.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `${type}`,
          text: `Your message is: ${message}`,
        });
        console.log(`Message sent to email: ${user.email}`);
        recipients.push(user.email); // Store only the specific user's email in recipients for non-global notification
      }
      //recipients.push(user.email);
      // Save notification in the database
      await Notification.create({
        message,
        type,
        isGlobal,
        recipients, // Store the email of the specific user
      });

      return res.status(200).json({
        success: true,
        message: "Notification sent to the specified user.",
      });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ message: "Error sending email notification.", error });
  }
};

const allNotification = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;

    const query = {
      deleted_at: null,
    };
    if (search) {
      query.message = { $regex: search, $options: "i" };
    }

    const result = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Notification.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    console.error("Error geting notification:", error);
    res
      .status(500)
      .json({ message: "Error geting email notification.", error });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Notification.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Plane Crash record not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res
      .status(500)
      .json({ message: "Error deleting email notification.", error });
  }
};

module.exports = {
  sendEmailNotification,
  allNotification,
  deleteNotification,
};
