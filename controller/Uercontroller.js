const usersignup = require("../models/UserModel");
const Usermodel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { exists, rawListeners } = require("../models/UserModel");
const session = require("express-session");
const { render } = require("ejs");
const transporter = require("../mail/transporter");
const { default: mongoose } = require("mongoose");
const prodect = require("../models/prodect");
const { query } = require("express");

module.exports = {
  home: async (req, res) => {
    try {
      const userid = req.session.log;
      await Usermodel.findOne({ _id: userid })
        .then((user) => {
          res.render("user/home", { user });
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error) ;
    }
  },

  getsignup: (req, res) => {
    res.render("user/signup");
  },

  postsignup: async (req, res) => {
    try {
      const email = req.body.email;
      const userExist = await Usermodel.findOne({ email: email });
      if (userExist) {
        return res.status(400).json({ msg: "email already exists" });
      } else {
        const token = Math.floor(10000 + Math.random() * 900000);

        req.body.Token = token;
        req.session.signup = req.body;
        transporter.sendMail({
          from: "carway@gmail.com",
          to: email,
          subject: "OTP verification",
          html:
            "<h3>OTP for account verification is </h3>" +
            "<h1 style='font-weight:bold;'>" +
            token +
            "</h1>",
        }),
          res.render("user/otp");
      }
    } catch (error) {
      console.log(error);
    }
  },

  getotpverification: async (req, res) => {
    try {
      let { name, email, Token } = req.session.signup;
      if (req.query.id) {
        const token = Math.floor(10000 + Math.random() * 900000);
        transporter.sendMail({
          from: "carway@gmail.com",
          to: email,
          subject: "OTP verification",
          html:
            "<h3> Mr  OTP for account verification is </h3>" +
            "<h1 style='font-weight:bold;'>" +
            token +
            "</h1>",
        });
        req.session.signup.Token = token;
        res.render("user/otp");
      }
    } catch (error) { }
  },

  otpverification: async (req, res) => {
    try {
      console.log(req.session.signup);
      console.log("helooo");

      let { name, email, password, username, Token } = req.session.signup;
      if (req.body.otp == Token) {
        console.log(password, "heloooo");
        bcrypt.hash(password, 10).then((hashedPassword) => {
          password = hashedPassword;
          console.log(password, "hai");
          const newUser = new usersignup({ name, email, password, username });
          console.log(newUser, "hlooooooo");
          newUser.save();
        });

        res.redirect("/login");
      } else {
        res.redirect("/otp");
      }
    } catch (error) {
      console.log(error);
    }
  },

  getlogin: (req, res) => {
    if (req.session.log) {
      res.redirect("/login");
    } else {
      const error = req.session.loginerr;
      res.render("user/login");
      console.log(error);
    }
  },

  postlogin: async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body, "helllo");
    const user = await Usermodel.findOne({ email: email });
    if (!user) {
      res.status(401).json({ msg: "user not founded" });
    }
    if (user) {
      bcrypt.compare(password, user.password).then((isvalid) => {
        if (isvalid) {
          req.session.log = user;
          res.redirect("/home");
        } else {
          res.redirect("/login");
        }
      });
    }
  },


  userlogout: async (req, res) => {
    try {
      req.session.log = null;
      res.redirect("/home");
    } catch (error) {
      console.log(error);
    }
  },

  getproductdetails: async (req, res) => {
    try {
      if (req.session.log) {
        let prodects = await prodect.find();
        console.log(prodects, "hiptodet");
        res.render("user/prodect");
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error);
    }
  },



  postsearch: async (req, res) => {
    try {
      // const result = req.query.q;
      // console.log(result);

      const agg = [
        { $search: { autocomplete: { query: req.query.q, path: "name" } } },
        { $limit: 10 },
        { $project: { name: 1 } },
      ];

      const result = await prodect.aggregate(agg);
      console.log(result);
      res.json({result});

    } catch (error) {
      console.log(error);
    }
  },
};
