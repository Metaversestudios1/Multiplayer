const mongoose = require("mongoose");

const AllGameSettingsSchema = new mongoose.Schema(
  {
    gameName: { type: String, required: true, unique: true, trim: true },
    status: { type: Number, default: 1, enum: [0, 1] }, // 0 = Inactive, 1 = Active
    deleted_at: { type: Date, default: null }, 
    config: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Flexible configuration for each game
      default: {},
    },
    version: { type: String, default: "1.0.0" },
    minPlayers: { type: Number, default: 1, min: 1 },
    maxPlayers: { type: Number, default: 1, min: 1 },
    initialBonus: { type: Number, default: 0, min: 0 },
    withdrawalFee: { type: Number, default: 0, min: 0 },
    minBetAmount: { type: Number, default: 1, min: 1 },
    minRecharge: { type: Number, default: 1, min: 1 },
    minWithdraw: { type: Number, default: 1, min: 1 },
    startGameRangeTimer: { type: Number, default: 0, min: 0 },
    endGameRangeTimer: { type: Number, default: 0, min: 0 },
    releaseDate: { type: Date, default: null },
    features: [{ type: String, trim: true }],
  },
  { timestamps: true, collection: "allgame_settings" }
);

module.exports = mongoose.model("AllGameSettings", AllGameSettingsSchema);
