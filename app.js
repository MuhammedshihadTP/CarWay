const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const bodyparser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookiparser = require("cookie-parser");
const session = require("express-session");
const nocach=require('nocache');
const multer=require('multer');
const fs=require('fs')
// const ejslint=require('ejs-lint')
require('dotenv').config()


// connecting mongoose
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to the mongoose");
});




const app = express();
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now()+path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};



//cache clearing... 
app.use(function (req, res, next) {
res.set('cache-control','no-store')
next();
})

app.use(cookiparser());
app.use(
  session({
    secret: "abcdsf",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
  })
);

app.use(express.static("public"));
app.use(expresslayouts);
app.use(bodyparser.urlencoded({ extended: true ,limit:"10mb"}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.set("layout", "layout/layout")
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image"))

const userrouter = require("./routers/userRouter");
const adminrouter=require("./routers/adminRouter");

const { url } = require("inspector");
const { urlencoded } = require("express");


app.use("/", userrouter);
app.use("/admin",adminrouter);

app.listen(3000, () => {
  console.log("started");
});
