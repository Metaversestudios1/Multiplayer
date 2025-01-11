const mongoose = require("mongoose");

const GameSettingsSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Games",
      required: true,
    },
    gameType: { type: String, required: true }, // Match this with the game's `type`
    settings: { type: mongoose.Schema.Types.Mixed, required: true }, // Dynamic settings
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GameSettings", GameSettingsSchema);
