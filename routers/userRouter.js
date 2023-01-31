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
} = require("../controller/Uercontroller");
const router = Router();

router.get("/", home);
router.get("/home",home);
router.get("/signup", getsignup);
router.post("/signup", postsignup);
router.get("/login", getlogin);
router.post("/login", postlogin);
router.get("/",userlogout)

module.exports = router;
