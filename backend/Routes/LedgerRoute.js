const { getLedgerByUser } = require("../Controllers/LedgerController");
const express = require("express");
const router = express.Router();

router.post("/getledgerbyuser", getLedgerByUser);

module.exports = router;
