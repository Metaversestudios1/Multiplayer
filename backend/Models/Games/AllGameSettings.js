const mongoose = require("mongoose");

const AllGameSettingsSchema = new mongoose.Schema(
  {
    games: [
      {
        gameName: { type: String },
        status: { type: Number, default: 1 }, // Active or Inactive (1/0)
        deleted_at: { type: Date, default: null }, // Soft delete field
        config: {
          type: Map,
          of: mongoose.Schema.Types.Mixed, // Flexible configuration for each game
        },
      },
    ],
    status: { type: Number, default: 1 }, // Overall settings status (Active/Inactive)
  },
  { timestamps: true, collection: "allgame_settings" }
);

module.exports = mongoose.model("AllGameSettings", AllGameSettingsSchema);
