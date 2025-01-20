const mongoose = require("mongoose");

const LudoHistorySchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "AllGameSettings" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: { type: Number, default: 1, enum: [0, 1] }, // 0 = Inactive, 1 = Active
    deleted_at: { type: Date, default: null },
    winning_amount: { type: Number, default: 0 },
    user_amount: { type: Number, default: 0 },
    admin_commission: { type: Number, default: 0 },
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Flexible configuration for each game
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LudoHistory", LudoHistorySchema);
