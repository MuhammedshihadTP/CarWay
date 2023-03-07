const { Router } = require("express");
const express = require("express");
const authentication = require("../middleware/auth");
const {
  home,
  getsignup,
  postsignup,
  getlogin,
  postlogin,
  userlogout,
  otpverification,
  getotpverification,
  getproductdetails,
  getsucssuse,
  getfailed,
  postCart,
  getavalabelcars,
  getprofilepage,
  updateprofilepage,
  search,
  getcargrid,
  showCart,
  Remoecart,
  CoupencheackOut,
  CartCheackOut,
  PaymentCheacOut,
  myBookings,
} = require("../controller/Uercontroller");
const router = Router();
router.get("/", home);
router.get("/home", home);
router.get("/signup", getsignup);
router.post("/signup", postsignup);
router.post("/otp", otpverification);
router.get("/otp", getotpverification);
router.get("/login", getlogin);
router.post("/login", postlogin);
router.get("/logout", userlogout);
router.get("/prodect/:id", getproductdetails);
router.get("/search", search);
router.get("/Sucssus", getsucssuse);
router.get("/failed", getfailed);
router.get("/cart", showCart);
router.post("/cart", postCart);
router.post("/coupen",CoupencheackOut)
router.get("/ChEackout/:id",CartCheackOut)
router.post("/ChEackout/:id",PaymentCheacOut);
router.get("/cars", getcargrid);
router.post("/cars", getavalabelcars);
router.get("/profile/:id", getprofilepage);
router.post("/Profile/:id", updateprofilepage);
router.get('/Cartremove/:id',Remoecart);
router.get('/oders',myBookings);
module.exports = router;
