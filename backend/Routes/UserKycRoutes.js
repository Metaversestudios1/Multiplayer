const {
  insertUserBank,
  updateUserBank,
  getAllUserBank,
  getSingleUserBank,
  deleteUserBank,
  updatekycstatus,
  getSingleUserBankID,
  getApprovedWithdraw,
  getApprovedRecharge,
  getRejectedWithdraw,
  getRejectedRecharge,
  addRecahrgeHistory,
  addWithdrawHistory,
} = require("../Controllers/KycController");
const express = require("express");
const router = express.Router();

router.post("/insertUserBank", insertUserBank);
router.put("/updateUserBank", updateUserBank);
router.get("/getAllUserBank", getAllUserBank);
router.get("/getSingleUserBankID/:id", getSingleUserBankID);
router.post("/updatekycstatus/:id", updatekycstatus);
router.post("/getSingleUserBank", getSingleUserBank);
router.delete("/deleteUserBank", deleteUserBank);

router.get("/getapprovedwithdraw", getApprovedWithdraw);
router.get("/getapprovedrecharge", getApprovedRecharge);
router.get("/getrejectedwithdraw", getRejectedWithdraw);
router.get("/getrejectedrecharge", getRejectedRecharge);

router.post("/addrecahrgehistory", addRecahrgeHistory);
router.post("/addwithdrawhistory", addWithdrawHistory);

module.exports = router;
