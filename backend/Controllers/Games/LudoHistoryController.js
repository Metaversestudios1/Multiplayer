const LudoHistory = require("../../Models/Games/LudoHistory");

const getAllLudoHistory = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = parseFloat(req.query.search);

    const query = {
      deleted_at: null,
    };

    if (search) {
      query.$or = [
        { winning_amount: search || 0 },
        { user_amount: search || 0 },
        { admin_comission: search || 0 },
      ];
    }

    const LudoHistoryData = await LudoHistory.find(query)
      .populate("userId", "username email")
      .populate("gameId", "gameName config")
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    //console.log("Ludohistory:", LudoHistoryData);

    const count = await LudoHistory.find().countDocuments();
    res.status(200).json({ success: true, result: LudoHistoryData, count });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error ludo history details",
    });
  }
};

const addLudoHistory = async (req, res) => {
  try {
    //console.log(req.body);
    const { user_id, game_id, winning_amount, user_amount, admin_commission } =
      req.body;

    const newLudoHistory = new LudoHistory({
      userId: user_id,
      gameId: game_id,
      winning_amount,
      user_amount,
      admin_commission,
    });

    await newLudoHistory.save();

    res
      .status(201)
      .json({ success: true, message: "Ludo history data added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding ludo history data ",
    });
  }
};

module.exports = {
  getAllLudoHistory,
  addLudoHistory,
};
