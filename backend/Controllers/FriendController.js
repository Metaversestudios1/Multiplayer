const FriendRequest = require("../Models/FriendRequest");
const User = require("../Models/User");

const sendFriendRequest = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.body;

    // Validate input
    if (!sender_id || !receiver_id) {
      return res.status(400).json({
        success: false,
        message: "Sender and Receiver IDs are required",
      });
    }

    if (sender_id === receiver_id) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: sender_id, receiver: receiver_id },
        { sender: receiver_id, receiver: sender_id },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Friend request already exists" });
    }

    // Create new friend request
    const newRequest = new FriendRequest({
      sender: sender_id,
      receiver: receiver_id,
      status: "pending", // pending | accepted | rejected
    });

    await newRequest.save();
    res
      .status(201)
      .json({ success: true, message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find friend requests related to the user
    const requests = await FriendRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "username")
      .populate("receiver", "username");

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  sendFriendRequest,
  getFriendRequests,
};
