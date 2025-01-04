const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    isGlobal: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    recipients: { type: [String], default: [] },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"],
      default: "info",
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "notifications",
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
