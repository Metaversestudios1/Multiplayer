const {
  getAllLudoHistory,
  addLudoHistory,
} = require("../../Controllers/Games/LudoHistoryController");

const express = require("express");
const router = express.Router();

//game data route

router.post("/addludohistory", addLudoHistory);
router.get("/getallludohistory", getAllLudoHistory);

module.exports = router;
