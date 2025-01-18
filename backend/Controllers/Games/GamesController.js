
const AllGameSettings = require("../../Models/Games/AllGameSettings");


const getAllGameSettings = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;
    const query = {
      deleted_at: null,
  };
  if (search) {
      query.gameName = { $regex: search, $options: "i" };
  }

  const result = await AllGameSettings.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  const count = await AllGameSettings.find(query).countDocuments();
  res.status(200).json({ success: true, result, count });

   
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error getting game details",
    });
  }
};

const AddAllGameSettings = async (req, res) => {
  try {
    const {
      gameName, status, config, minPlayers, maxPlayers, initialBonus, withdrawalFee, 
      minBetAmount, minRecharge, startGameRangeTimer, endGameRangeTimer, releaseDate, features 
    } = req.body;

    const parsedReleaseDate = releaseDate ? new Date(releaseDate) : null;
    const featuresArray = Array.isArray(features) ? features : features.split(",").map(f => f.trim());

    const newGame = new AllGameSettings({
      gameName,
      status: parseInt(status),
      config,
      minPlayers,
      maxPlayers,
      initialBonus,
      withdrawalFee,
      minBetAmount,
      minRecharge,
      startGameRangeTimer,
      endGameRangeTimer,
      releaseDate: parsedReleaseDate || null,
      features: featuresArray 
    });

    await newGame.save();

    res.status(201).json({ success: true, message: "Game settings added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding game details",
    });
  }
};



const DeleteAllGameSettings = async (req, res) => {
  try {
    const { game_id } = req.body; // `settingId` is the ID of the record, `gameIndex` is the index of the game in the array

    if (!game_id) {
      return res.status(400).json({ success: false, message: "Game ID is required." });
    }

    const game = await AllGameSettings.findById(game_id);

   

    game.deleted_at = new Date();
    await game.save();

    res.status(200).json({ success: true, message: "Game setting deleted successfully." });

   
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error geting game details",
    });
  }
};

module.exports = {
  getAllGameSettings,
  AddAllGameSettings,
  DeleteAllGameSettings,
};
