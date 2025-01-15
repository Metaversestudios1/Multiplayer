const mongoose = require("mongoose");

const AllGameSettingsSchema = new mongoose.Schema(
  {
    games: [
      {
        gameName: { type: String },
        status: { type: Number, default: 1 }, 
        deleted_at: { type: Date, default: null }, 
        config: {
          type: Map,
          of: mongoose.Schema.Types.Mixed, // Flexible configuration for each game
        },
        version: { type: String, default: "1.0.0" },
        minPlayers: { type: Number,default:1},
        maxPlayers: { type: Number,default:1},
        initialBonus:{type:Number,default:0},
        withdrawalFee:{type:Number},
        minBetAmount:{type:Number},
        minRecahrge:{type:Number},
        minWithdraw:{type:Number},
        startGameRangeTimer:{type:Number},
        endGameRangeTimer:{type:Number},
        releaseDate: { type: Date, default: null },
        features: [{ type: String }],
      },
    ],
    status: { type: Number, default: 1 }, // Overall settings status (Active/Inactive)
  },
  { timestamps: true, collection: "allgame_settings" }
);

module.exports = mongoose.model("AllGameSettings", AllGameSettingsSchema);
