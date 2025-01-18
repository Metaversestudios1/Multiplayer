const {
  addTestGameData,
  getAllTestGameData,
} = require("../../Controllers/Games/GamesDataController");

const express = require("express");
const router = express.Router();

//game data route

router.post("/addtestgamedata", addTestGameData);
router.get("/getalltestgamedata", getAllTestGameData);

module.exports = router;
