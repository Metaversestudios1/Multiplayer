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
  loginUser,
  logoutUser,
} = require("../Controllers/UserController");

const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB for images
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG are allowed."), false);
    }
  },
});

router.post("/insertuser", insertuser);
router.put("/updateuser", upload.single("avatar"), updateuser);
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
router.post("/loginuser", loginUser);
router.post("/logoutuser", logoutUser);

module.exports = router;
