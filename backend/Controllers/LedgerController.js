const Ledger = require("../Models/Ledger");
const User = require("../Models/User");

const getLedgerByUser = async (req, res) => {
  try {
    const ledgerEntries = await Ledger.find({ user_id: req.body.id });

    const userdetails = await User.findById(req.body.id); // Use findById since we're fetching by ID directly

    const username = userdetails ? userdetails.username : "Unknown"; // Default to 'Unknown' if user is not found

    // Add the username to each ledger entry
    const updatedLedgerEntries = ledgerEntries.map((entry) => ({
      ...entry.toObject(), // Convert the Mongoose document to plain object
      username: username, // Add the username to the entry
    }));

    res.status(200).json({ success: true, result: updatedLedgerEntries });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting ledger",
      error: error.message,
    });
  }
};

module.exports = {
  getLedgerByUser,
};
