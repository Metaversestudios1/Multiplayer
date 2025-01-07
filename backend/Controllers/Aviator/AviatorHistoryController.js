const history = require("../../Models/Aviator/AviatorHistory");
const bcrypt = require("bcrypt");
const User = require("../../Models/User");

const getAllaviatorhistory = async (req, res) => {
  try {
    //console.log("getAllaviatorhistory endpoint was hit");
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;

    const query = {
      deleted_at: null,
    };
    // if (search) {
    //   query.totalBet = { $regex: search, $options: "i" };
    // }

    // If search is provided, handle it as a numeric range or exact match
    if (search) {
      const searchValue = parseFloat(search);
      if (!isNaN(searchValue)) {
        query.totalBet = searchValue;
      }
    }
    //console.log("query", query);
    const result = await history
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await history.find(query).countDocuments();
    // Extract unique userIds from history
    // const userIds = [
    //   ...new Set(
    //     result.flatMap((record) => record.users.map((user) => user.userId))
    //   ),
    // ];

    // Fetch all users with selected fields
    // const allUsers = await User.find({ _id: { $in: userIds } }).select(
    //   "username _id"
    // );

    const allUsers = await User.find().select("username _id");

    //console.log(allUsers);

    // Attach usernames to the final result
    const finalResult = result.map((record) => {
      const usersWithDetails = record.users.map((user) => {
        const matchingUser = allUsers.find(
          (u) => u._id.toString() === user.userId
        );
        return {
          ...user,
          username: matchingUser ? matchingUser.username : "Unknown", // Attach username
        };
      });

      return {
        ...record.toObject(),
        users: usersWithDetails,
      };
    });
    //console.log(finalResult);

    res.status(200).json({ success: true, result: finalResult, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error geting aviation history" });
  }
};

module.exports = {
  getAllaviatorhistory,
};
