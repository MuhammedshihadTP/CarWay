const { Router } = require("express");
const express = require("express");
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
router.get('/prodect',getproductdetails);
router.get("/search",postsearch);


module.exports = router;
