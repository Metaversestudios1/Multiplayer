const {
  insertuser,
  updateuser,
  userlogin,
  getAlluser,
  verifyotpreg,
  deleteuser,
  getSingleuser,
  userlogout,
  verifyOtp,
  sendotp,
  resetPassword,
  sendmailsms,
  getSumOfWallet,
  getSumOfBonus,
  changeUserStatus,
  addWalletUser,
  removeWalletUser,
} = require("../Controllers/UserController");
const express = require("express");
const router = express.Router();

router.post("/insertuser", insertuser);
router.put("/updateuser", updateuser);
router.post("/userlogin", userlogin);
router.get("/getAlluser", getAlluser);
router.post("/getSingleuser", getSingleuser);
router.delete("/deleteuser", deleteuser);
router.post("/userlogout", userlogout);
router.post("/sendotp", sendotp);
router.post("/verifyOtp", verifyOtp);
router.post("/resetPassword", resetPassword);
router.post("/sendmailsms", sendmailsms);
router.post("/verifyotpreg", verifyotpreg);
router.get("/getsumofwallet", getSumOfWallet);
router.get("/getsumofbonus", getSumOfBonus);
router.put("/changeuserstatus/:userId", changeUserStatus);
router.put("/addwalletuser", addWalletUser);
router.put("/removewalletuser", removeWalletUser);

module.exports = router;
