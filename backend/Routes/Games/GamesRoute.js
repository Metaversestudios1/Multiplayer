const {
  getAllGameSettings,
  AddAllGameSettings,
  DeleteAllGameSettings,
} = require("../../Controllers/Games/GamesController");


const express = require("express");
const router = express.Router();



//allgame
router.get("/allgamesettings", getAllGameSettings);
router.post("/addallgamesettings", AddAllGameSettings);
router.delete("/deleteallgamesettings", DeleteAllGameSettings);

module.exports = router;
