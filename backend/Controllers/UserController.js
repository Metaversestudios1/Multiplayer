const User = require("../Models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const Promocode = require("../Models/User");
const Ledger = require("../Models/Ledger");
const AviatorSetting = require("../Models/Setting");
const path = require("path");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (buffer, originalname, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!mimetype || typeof mimetype !== "string") {
      return reject(new Error("MIME type is required and must be a string"));
    }

    if (!mimetype.startsWith("image")) {
      return reject(new Error("Only image files are allowed"));
    }

    const fileExtension = path.extname(originalname);
    const fileNameWithoutExtension = path.basename(originalname, fileExtension);
    const publicId = `${fileNameWithoutExtension}${fileExtension}`; // Include extension in public_id

    const options = {
      resource_type: "image", // Explicitly set the resource type to image
      public_id: publicId, // Set the public_id with extension
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    cloudinary.uploader.upload(
      `data:${mimetype};base64,${buffer.toString("base64")}`,
      options,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error("Cloudinary upload failed"));
        }
        console.log("Cloudinary upload result:", result);
        resolve(result);
      }
    );
  });
};

const sendmailsms = async (req, res) => {
  const { email, contact } = req.body;
  try {
    let existingUser;

    // Check for existing user by email or contact
    if (email) {
      existingUser = await User.findOne({ email });
    }

    if (contact) {
      existingUser = await User.findOne({ contact });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or mobile number already used." });
    }

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

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .padStart(6, "0");

    // Check if email is present and send OTP via email
    if (email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
      });
      console.log(`OTP sent to email: ${email}`);
    }

    //Check if contact is present and send OTP via SMS
    // if (contact) {
    //   const formattedContact = contact.startsWith("+")
    //     ? contact
    //     : `+91${contact}`; // Assuming +91 is the country code for India
    //   const twilioClient = twilio(
    //     process.env.TWILIO_SID,
    //     process.env.TWILIO_AUTH_TOKEN
    //   );
    //   const message = await twilioClient.messages.create({
    //     body: `Your registration confirmation code is ${otp}`, // Customize the message body
    //     from: process.env.TWILIO_PHONE_NUMBER, // This should be a valid Twilio number
    //     to: formattedContact, // Ensure this is the correct format for the recipient number
    //   });
    //   console.log(`OTP sent to SMS: ${formattedContact}`);
    // }

    const otpExpires = Date.now() + 10 * 60 * 1000;

    if (contact) {
      const newUser = new User({
        email,
        contact,
        otp, // Store OTP
        otpExpires,
        isVerified: false, // Mark as unverified until OTP is confirmed
      });

      const dbresponse = await newUser.save();
      if (dbresponse) {
        res
          .status(200)
          .json({ success: true, message: "OTP sent successfully", otp });
      }
    } else {
      const newUser = new User({
        email,
        otp, // Store OTP
        otpExpires,
        isVerified: false, // Mark as unverified until OTP is confirmed
      });

      const dbresponse = await newUser.save();
      if (dbresponse) {
        res
          .status(200)
          .json({ success: true, message: "OTP sent successfully", otp });
      }
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

const verifyotpreg = async (req, res) => {
  const { email, contact, otp } = req.body;
  try {
    let user;

    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found with this email." });
      }
    }

    if (contact) {
      user = await User.findOne({ contact });

      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found with this contact." });
      }
    }

    // Check if OTP exists for the user
    if (!user.otp) {
      return res.status(400).json({
        message: "OTP has not been generated or has already been used.",
      });
    }

    // Check if the OTP has expired
    if (user.otpExpiresreg && user.otpExpiresreg < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }
    if (user.otp == otp) {
      user.isVerified = true;
      user.otp = undefined; // Remove OTP after verification
      user.otpExpiresAt = undefined; // Clear expiration time
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "User verified successfully." });
    } else {
      return res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const insertuser = async (req, res) => {
  const { password, promocode, ...userData } = req.body;

  try {
    //console.log("insert user:", req.body);
    // Check for required fields: password and either email or contact
    if (!password || (!userData.email && !userData.contact)) {
      return res.status(401).json({
        success: false,
        message:
          "Please provide all required fields: password and either email or contact.",
      });
    }

    // Password length validation
    if (password.length < 4) {
      return res.status(401).json({
        success: false,
        message: "Password must contain a minimum of 4 digits",
      });
    }

    const query = {};
    if (userData.email) query.email = userData.email;
    if (userData.contact) query.contact = userData.contact;

    const existingUser = await User.findOne(query);

    // Check for existing user by email or contact
    // const existingUser = await User.findOne({
    //   $or: [{ email: userData.email }, { contact: userData.contact }],
    // });

    if (existingUser) {
      // Update existing user's fields
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(password, salt); // Hash the password
      existingUser.currency = userData.currency || existingUser.currency; // Update currency if provided
      let uniqueUId;
      let isUnique = false;

      while (!isUnique) {
        uniqueUId = `T${Math.floor(10000 + Math.random() * 90000)}`; // Generates a string like 'T12345'
        const existingId = await User.findOne({ user_id: uniqueUId });
        if (!existingId) {
          isUnique = true; // If no existing user has this u_id, we can use it
        }
      }
      existingUser.user_id = uniqueUId; // Set the unique u_id

      // if (promocode) {
      existingUser.promocode = `PROMO_${existingUser.user_id
        .toString()
        .slice(0, 4)
        .toUpperCase()}`; // Adjust as necessary

      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: "User register successfully" });
    }

    // If no existing user found, respond with an error
    return res.status(404).json({ success: false, message: "User not found" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error registration user",
      error: err.message,
    });
  }
};

// const updateuser = async (req, res) => {
//   const updatedata = req.body;
//   const id = updatedata.id;
//   try {
//     const result = await User.updateOne(
//       { _id: id },
//       { $set: updatedata.oldData }
//     );
//     if (!result) {
//       res.status(404).json({ success: false, message: "user not found" });
//     }
//     res.status(201).json({ success: true, result: result });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "error in updating the user",
//       error: err.message,
//     });
//   }
// };
const updateuser = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;
  //console.log("Old Data:", req.body.oldData);
  //console.log("Req Data:", req.body);
  try {
    // Fetch the current user data to get the previous coin value
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    //console.log(user);

    // Ensure the previous coins value is a number, default to 0 if it's non-existent or a string
    let previousBalance = user.balance;

    if (
      previousBalance === undefined ||
      previousBalance === "0" ||
      previousBalance === null
    ) {
      previousBalance = 0;
    } else {
      previousBalance = Number(previousBalance);
    }
    // console.log("old data bonus", updatedata.bonus);
    // Default bonus to 0 if not provided
    const bonus = updatedata.bonus ? Number(updatedata.bonus) : 0;

    // Calculate the new balance value
    updatedata.balance = previousBalance + bonus;
    //console.log("file data:", req.file);
    let imageData = null;
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;
      if (!mimetype || typeof mimetype !== "string") {
        console.error("Invalid MIME type:", mimetype);
        return res
          .status(400)
          .json({ success: false, message: "Invalid MIME type" });
      }

      const uploadResult = await uploadImage(buffer, originalname, mimetype);
      if (!uploadResult) {
        return res
          .status(500)
          .json({ success: false, message: "File upload error" });
      }
      imageData = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        originalname,
        mimetype,
      };
    }

    //console.log("iamge data:", imageData);
    let result;
    if (imageData) {
      result = await User.updateOne(
        { _id: id },
        {
          $set: {
            ...updatedata,
            balance: updatedata.balance,
            avatar: imageData,
          },
        }
      );
    } else {
      result = await User.updateOne(
        { _id: id },
        {
          $set: {
            ...updatedata,
            balance: updatedata.balance,
          },
        }
      );
    }

    // Check if the update actually modified the document
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No changes were made to the user data",
      });
    }

    if (req.body.bonus > 0) {
      // Create the ledger entry for the transaction
      const ledgerEntry = new Ledger({
        source: "admin add", // or "admin deduct"
        user_id: id,
        balance: updatedata.balance,
        amount: bonus,
      });

      await ledgerEntry.save();
    }

    res.status(201).json({ success: true, result: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in updating the user",
      error: err.message,
    });
  }
};

const userlogin = async (req, res) => {
  const { email, password, contact } = req.body;
  try {
    if (!password || (!email && !contact)) {
      return res
        .status(404)
        .json({ sucess: false, message: "please provide all fields" });
    }
    const query = {};
    if (email) query.email = email;
    if (contact) query.contact = contact;

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ sucess: false, message: "user not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(404)
        .json({ sucess: false, message: "Password does not match" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const options = {
      expires: new Date(Date.now() + 2592000000),
      httpOnly: true,
      sameSite: "None",
    };
    res.cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

const getAlluser = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;

    const query = {
      deleted_at: null,
    };
    if (search) {
      query.username = { $regex: search, $options: "i" };
    }

    const result = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await User.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "error inserting user" });
  }
};
const getSingleuser = async (req, res) => {
  const { id } = req.body;
  try {
    const result = await User.findOne({ _id: id });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching user" });
  }
};

const deleteuser = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await User.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "error fetching user" });
  }
};
const userlogout = async (req, res) => {
  res.clearCookie("connect.sid"); // Name of the session ID cookie
  res.clearCookie("token"); // Name of the session ID cookie
  res.status(200).json({ status: true, message: "Successfully logged out" });
};

const sendotp = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const update = await User.updateOne(
      { email: user.email },
      {
        $set: {
          resetOtp: otp,
          otpExpires: otpExpires,
        },
      }
    );
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
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find employee by email and OTP
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (User.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
};
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    // Check if both email and new password are provided
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const getSumOfWallet = async (req, res) => {
  try {
    // Aggregate to sum the balance of all users where deleted_at is null
    const result = await User.aggregate([
      { $match: { deleted_at: null } }, // Filter out users with non-null deleted_at
      { $group: { _id: null, totalBalance: { $sum: "$balance" } } }, // Sum up the balance field
    ]);

    // Extract the totalBalance or default to 0 if no matching users
    const totalBalance = result.length > 0 ? result[0].totalBalance : 0;
    //console.log("total balance:", totalBalance);
    res.status(200).json({
      success: true,
      totalBalance: totalBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const getSumOfBonus = async (req, res) => {
  try {
    // Aggregate to sum the bonus of all users where deleted_at is null
    const result = await User.aggregate([
      { $match: { deleted_at: null } }, // Filter out users with non-null deleted_at
      { $group: { _id: null, totalBonus: { $sum: "$bonus" } } }, // Sum up the bonous field
    ]);

    // Extract the totalBonus or default to 0 if no matching users
    const totalBonus = result.length > 0 ? result[0].totalBonus : 0;
    //console.log("total bonus:", totalBonus);
    res.status(200).json({
      success: true,
      totalBonus: totalBonus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const changeUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  try {
    const result = await User.updateOne({ _id: userId }, { $set: { status } });

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or status unchanged",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const addWalletUser = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;

  try {
    // Fetch the current user data to get the previous balance value
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure the previous balance value is a number, default to 0 if it's non-existent or a string
    let previousBalance = user.balance;

    if (
      previousBalance === undefined ||
      previousBalance === "0" ||
      previousBalance === null
    ) {
      previousBalance = 0;
    } else {
      previousBalance = Number(previousBalance);
    }

    // Default amount to 0 if not provided
    const amount = updatedata.oldData.amount
      ? Number(updatedata.oldData.amount)
      : 0;

    // Calculate the new balance value
    const newBalance = previousBalance + amount;

    // Update the user's balance (no need to update coins)
    const result = await User.updateOne(
      { _id: id },
      {
        $set: {
          balance: newBalance, // Only update the balance field
        },
      }
    );

    // Check if the update actually modified the document
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No changes were made to the user data",
      });
    }

    //console.log("Update result:", result);

    // Create the ledger entry for the transaction
    const ledgerEntry = new Ledger({
      source: "admin add", // or "admin deduct"
      user_id: id,
      balance: newBalance,
      amount: amount,
    });

    await ledgerEntry.save();

    res.status(201).json({ success: true, result: result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in updating the user",
      error: err.message,
    });
  }
};

const removeWalletUser = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;

  try {
    // Fetch the user data by id
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get the current balance, ensuring it's a number
    let previousBalance = user.balance;
    if (
      previousBalance === undefined ||
      previousBalance === "0" ||
      previousBalance === null
    ) {
      previousBalance = 0;
    } else {
      previousBalance = Number(previousBalance);
    }

    console.log("previos balance:", previousBalance);

    // Get the amount to be subtracted (ensure it's a number)
    const amount = updatedata.oldData.amount
      ? Number(updatedata.oldData.amount)
      : 0;

    // Calculate the new balance after subtraction
    const newBalance = previousBalance - amount;

    // Ensure the new balance is valid (i.e., it shouldn't go negative if that's not allowed)
    if (newBalance < 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance to remove the specified amount",
      });
    }

    // Perform the update on the user's balance field only
    const result = await User.updateOne(
      { _id: id },
      {
        $set: {
          balance: newBalance, // Only update the balance field
        },
      }
    );

    // If no changes were made, return an error
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No changes were made to the user data",
      });
    }

    // Create the ledger entry for the transaction
    const ledgerEntry = new Ledger({
      source: "admin deduct", // or other sources
      user_id: id,
      balance: newBalance,
      amount: amount,
    });

    // Save the ledger entry
    await ledgerEntry.save();

    // Respond with the success result
    res.status(201).json({ success: true, result: result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in updating the user",
      error: err.message,
    });
  }
};

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (!email || !password) {
//       return res
//         .status(404)
//         .json({ sucess: false, message: "please provide all fields" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ sucess: false, message: "Email not found" });
//     }
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res
//         .status(404)
//         .json({ sucess: false, message: "Password does not match" });
//     }

//     const token = jwt.sign(
//       { id: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     const options = {
//       expires: new Date(Date.now() + 2592000000),
//       httpOnly: true,
//       sameSite: "None",
//     };
//     res.cookie("token", token, options).json({
//       success: true,
//       token,
//       user,
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server error: " + err.message });
//   }
// };

// const logoutUser = async (req, res) => {
//   try {
//     res.clearCookie("connect.sid"); // Name of the session ID cookie
//     res.clearCookie("token"); // Name of the session ID cookie
//     res
//       .status(200)
//       .json({ status: true, message: "Successfully logged out user" });
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = {
  insertuser,
  updateuser,
  userlogin,
  getAlluser,
  getSingleuser,
  deleteuser,
  userlogout,
  sendotp,
  verifyOtp,
  resetPassword,
  sendmailsms,
  verifyotpreg,
  getSumOfWallet,
  getSumOfBonus,
  changeUserStatus,
  addWalletUser,
  removeWalletUser,
};
