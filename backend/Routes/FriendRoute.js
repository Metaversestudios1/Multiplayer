const express = require("express");
const {
  sendFriendRequest,
  getFriendRequests,
} = require("../Controllers/FriendController");

const router = express.Router();

router.post("/sendFriendRequest", sendFriendRequest);

router.get("/friendRequests/:userId", getFriendRequests);
// router.post("/respondFriendRequest", respondToFriendRequest);

module.exports = router;
