const { Router } = require("express");
const express = require("express");
const {
  adminhome,
  postadminlogin,
  getadminsignup,
  postadminsignup,
  getadminlogin,
  getaddvehcles,
  postaddvehicles,
  viwevehcilelist,
  adminlogout,
  editvehcilelist,
  posteditvehicles,
  getdashbord,
  deletevehicless,
  getCoupens,
  getaddcoupen,
  postcoupen,
  geteditcoupen,
  postupdatecoupen,
  delcoupen,
  getuser,
  blockuser,
  unblockuser,
  bookingdetail,
  fornotfor
} = require("../controller/admincontroller");
const addmincontroller = require("../controller/admincontroller");
const { postlogin } = require("../controller/Uercontroller");

const router = Router();
router.get("/", adminhome);
router.get("/signup", getadminsignup);
router.post("/signup", postadminsignup);
router.get("/login", getadminlogin);
router.post("/login", postadminlogin);
router.get("/logout", adminlogout);
router.get('/dashbord',getdashbord)
router.get("/vehicles", getaddvehcles);
router.post("/vehicles", postaddvehicles);
router.get("/viewvehicles", viwevehcilelist);
router.get("/vehicles/:id", editvehcilelist);
router.post("/vehicles/:id",posteditvehicles);
router.get("/vehicless/:id",deletevehicless);
router.get("/coupen",getCoupens);
router.get("/addcoupen",getaddcoupen);
router.post("/addcoupen",postcoupen);
router.get("/addcoupen/:id",geteditcoupen);
router.post("/addcoupen/:id",postupdatecoupen);
router.get("/coupen/:id",delcoupen);
router.get('/users',getuser);
router.get("/Users/:id",blockuser);
router.get("/user/:id",unblockuser);
router.get("/booking",bookingdetail);
router.get("/404",fornotfor);

module.exports = router;
