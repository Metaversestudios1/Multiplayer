const mongoose = require("mongoose");

const TestGameDataSchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "AllGameSettings" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: { type: Number, default: 1, enum: [0, 1] }, // 0 = Inactive, 1 = Active
    deleted_at: { type: Date, default: null },
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Flexible configuration for each game
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestGameData", TestGameDataSchema);
