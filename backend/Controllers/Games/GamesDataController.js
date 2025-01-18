const TestGameData = require("../../Models/Games/TestGameData");
const AllGameSettings = require("../../Models/Games/AllGameSettings");
const User = require("../../Models/User");

const addTestGameData = async (req, res) => {
  try {
    // console.log("add test data", req.body);

    const newTestData = new TestGameData({
      userId: req.body.userId,
      gameId: req.body.gameId,
      data: req.body.data,
    });

    await newTestData.save();

    res
      .status(201)
      .json({ success: true, message: "Test Game data added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding game data details",
    });
  }
};

const getAllTestGameData = async (req, res) => {
  try {
    const testGameData = await TestGameData.find()
      .populate("userId", "username email")
      .populate("gameId", "config");

    const testGameData2 = await TestGameData.aggregate([
      {
        $lookup: {
          from: "user", // The name of the collection for the "User" model (case-sensitive)
          localField: "userId", // Field in TestGameData
          foreignField: "_id", // Reference field in the User collection
          as: "user", // Alias for the populated user data
        },
      },
      {
        $lookup: {
          from: "allgame_settings", // The name of the collection for the "AllGameSettings" model
          localField: "gameId", // Field in TestGameData
          foreignField: "_id", // Reference field in the AllGameSettings collection
          as: "game", // Alias for the populated game data
        },
      },
    ]);

    res.status(200).json({ success: true, data: testGameData2 });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error geting game data details",
    });
  }
};

module.exports = {
  addTestGameData,
  getAllTestGameData,
};
