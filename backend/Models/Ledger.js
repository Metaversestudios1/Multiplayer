const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  source: {
    type: String, // "admin add", "admin deduct", etc.
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  balance: {
    type: Number, // Wallet balance after transaction
    required: true,
  },
  amount: {
    type: Number, // Amount added or deducted
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ledger = mongoose.model("Ledger", ledgerSchema);

module.exports = Ledger;
