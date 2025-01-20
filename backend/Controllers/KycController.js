const UserBank = require("../Models/UserBankDetails");
const bcrypt = require("bcrypt");
const Transaction = require("../Models/Transaction");

// const insertUserBank = async (req, res) => {
//   try {
//     const newUserBank = new UserBank(req.body);
//     await newUserBank.save();
//     res.status(201).json({ success: true });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Error inserting User Bank details",
//       error: err.message,
//     });
//   }
// };

const insertUserBank = async (req, res) => {
  try {
    //console.log("user bank details:",req.body);
    const {
      user_id,
      bankname,
      accountno,
      account_holder_name,
      ifsc,
      mobile_no,
      upi_id,
      aadharno,
      pan_no,
    } = req.body;

    // Validate required fields
    //  if (!user_id || !bankname || !accountno || !account_holder_name || !ifsc|| !mobile_no || !pan_no) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }

    const existingUserBank = await UserBank.findOne({ user_id });
    if (existingUserBank) {
      return res
        .status(400)
        .json({ message: "User bank details already exist" });
    }

    // Create new user bank details
    const newUserBank = new UserBank({
      user_id,
      bankName: bankname,
      accountNo: accountno,
      accountholdername: account_holder_name,
      ifscCode: ifsc,
      mobileNo: mobile_no,
      upiId: upi_id || "", // Default empty if not provided
      aadharNo: aadharno,
      panNo: pan_no,
    });

    await newUserBank.save();
    res
      .status(201)
      .json({ message: "User bank details added successfully", success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error inserting User Bank details",
      error: err.message,
    });
  }
};

const updateUserBank = async (req, res) => {
  const updatedata = req.body;
  const id = updatedata.id;
  try {
    // console.log(updatedata.oldData)
    const result = await UserBank.updateOne(
      { _id: id },
      { $set: updatedata.oldData }
    );
    if (!result) {
      res.status(404).json({ success: false, message: "UserBank not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error in updating the User Bank",
      error: err.message,
    });
  }
};

const getAllUserBank = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const kycstatus = req.query.kycstatus;

    const query = {
      deleted_at: null,
    };
    if (search) {
      query.bankName = { $regex: search, $options: "i" };
    }
    if (kycstatus) {
      query.kycstatus = kycstatus; // Add transactionType if it exists
    }

    const result = await UserBank.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await UserBank.find(query).countDocuments();

    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching UserBank" });
  }
};
const getSingleUserBank = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await UserBank.findOne({ _id: id });
    if (!result) {
      res.status(404).json({ success: false, message: "UserBank not found" });
    }
    res.status(201).json({ success: true, result: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching UserBank" });
  }
};
const getSingleUserBankID = async (req, res) => {
  const { id } = req.params;
  try {
    const query = {
      id: id,
    };
    const result = await UserBank.find({ _id: id });
    if (!result) {
      res.status(404).json({ success: false, message: "UserBank not found" });
    }
    res.status(201).json({ success: true, result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching UserBank" });
  }
};

const deleteUserBank = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await UserBank.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "UserBank not found" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error fetching UserBank" });
  }
};

const updatekycstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.body.status;
    // console.log("KYC Controller:",status);
    // console.log("KYC Controller id:",id);
    const UserBanknew = await UserBank.findById(id);
    if (!UserBanknew) {
      return res
        .status(404)
        .json({ success: false, message: "UserBank not found" });
    }
    UserBanknew.KYCStatus = status;
    await UserBanknew.save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "error fetching bank details",
      error: err.message,
    });
  }
};

const getApprovedWithdraw = async (req, res) => {
  try {
    const count = await Transaction.countDocuments({
      transactionType: "withdraw",
      status: "approved",
    });

    // Return the count as a response
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const getApprovedRecharge = async (req, res) => {
  try {
    const count = await Transaction.countDocuments({
      transactionType: "recharge",
      status: "approved",
    });

    // Return the count as a response
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const getRejectedWithdraw = async (req, res) => {
  try {
    const count = await Transaction.countDocuments({
      transactionType: "withdraw",
      status: "rejected",
    });

    // Return the count as a response
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const getRejectedRecharge = async (req, res) => {
  try {
    const count = await Transaction.countDocuments({
      transactionType: "recharge",
      status: "rejected",
    });

    // Return the count as a response
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const addRecahrgeHistory = async (req, res) => {
  try {
    //console.log(req.body);
    const { user_id, paymentType, amount, status } = req.body;

    const newRechargeData = new Transaction({
      user_id,
      paymentType,
      amount,
      status,
      transactionType: "recharge",
    });

    await newRechargeData.save();

    res
      .status(201)
      .json({ success: true, message: "Recharge data added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const addWithdrawHistory = async (req, res) => {
  try {
    //console.log(req.body);
    const { user_id, paymentType, amount, status } = req.body;

    const newRechargeData = new Transaction({
      user_id,
      paymentType,
      amount,
      status,
      transactionType: "withdraw",
    });

    await newRechargeData.save();

    res
      .status(201)
      .json({ success: true, message: "Recharge data added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = {
  insertUserBank,
  updateUserBank,
  getAllUserBank,
  getSingleUserBank,
  deleteUserBank,
  updatekycstatus,
  getSingleUserBankID,
  getApprovedWithdraw,
  getApprovedRecharge,
  getRejectedWithdraw,
  getRejectedRecharge,
  addRecahrgeHistory,
  addWithdrawHistory,
};
