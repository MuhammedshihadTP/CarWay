const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const bodyparser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookiparser = require("cookie-parser");
const session = require("express-session");
const nocach=require('nocache')
require('dotenv').config()


// connecting mongoose
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to the mongoose");
});




const app = express();


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
    cookie: { maxAge: 60000 },
  })
);

app.use(express.static("public"));
app.use(expresslayouts);
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.set("layout", "layout/layout");

const router = require("./routers/userRouter");
const { url } = require("inspector");
const { urlencoded } = require("express");
app.use("/", router);

app.listen(3000, () => {
  console.log("started");
});
