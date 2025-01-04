const {
  sendEmailNotification,
  allNotification,
  deleteNotification,
} = require("../Controllers/NotificationController");
const express = require("express");
const router = express.Router();

router.post("/addnotification", sendEmailNotification);
router.get("/allnotification", allNotification);
router.delete("/deletenotification", deleteNotification);

module.exports = router;
