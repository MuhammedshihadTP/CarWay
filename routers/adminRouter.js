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
  deletevehicless
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

module.exports = router;
