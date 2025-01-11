const mongoose = require("mongoose");

const GamesSchema = new mongoose.Schema(
  {
    gamename: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
    },
    status: {
      type: Number,
      default: 1, // Tinyint equivalent
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "games" }
);

module.exports = mongoose.model("games", GamesSchema);
