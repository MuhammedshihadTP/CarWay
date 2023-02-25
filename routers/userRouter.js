const { Router } = require("express");
const express = require("express");
const authentication=require("../middleware/auth")
const {
  home,
  signup,
  getsignup,
  postsignup,
  getlogin,
  postlogin,
  userlogout,
  getopt,
  otpverification,
  getotpverification,
  getproductdetails,
  postsearch,
  getbookingform,
  postbooking,
  postpayment,
  getcartpage,
  addToCart,
  getcheaackoutform,
  getsucssuse,
  getfailed,
  postCart,
  getavalabelcars
} = require("../controller/Uercontroller");
const router = Router();

router.get("/", home);
router.get("/home",home);
router.get("/signup", getsignup);
router.post("/signup", postsignup);
router.post("/otp",otpverification);
router.get('/otp',getotpverification);
router.get("/login", getlogin);
router.post("/login", postlogin);
router.get("/logout",userlogout);
router.get('/prodect/:id',getproductdetails);
router.get("/search",postsearch);
router.post("/Bookings",postbooking);
router.get("/cheackout",getcheaackoutform);
router.post("/cheackout",postpayment);
router.get("/Sucssus",getsucssuse);
router.get("/failed",getfailed);
router.get("/cart",getcartpage);
router.post("/cart",postCart);
// router.post("/cars",getavalabelcars)
module.exports = router;
