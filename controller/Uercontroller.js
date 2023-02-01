const usersignup = require("../models/UserModel");
const Usermodel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { exists } = require("../models/UserModel");
const session = require("express-session");
const { render } = require("ejs");
const transporter = require("../mail/transporter");

module.exports = {
  home: async (req, res) => {
    try {
      const userid = req.session.log;
      await Usermodel.findOne({ _id: userid })
        .then((user) => {
          res.render("home", { user });
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  },

  getsignup: (req, res) => {
    res.render("signup");
  },

  postsignup: async (req, res) => {
    try {
      const email = req.body.email;
      const userExist = await Usermodel.findOne({ email: email });
      if (userExist) {
        return res.status(400).json({ msg: "email already exists" });
      } else {
        const token = Math.floor(100000 + Math.random() * 900000);

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
          res.render("otp");
      }
    } catch (error) {
      console.log(error);
    }
  },

  otpverification: async (req, res) => {
    try {
      let { name, email, password, username, Token } = req.session.signup;

      if (req.body.otp == Token) {
        console.log(password);

        bcrypt.hash(password, 10).then((hashedPassword) => {
          password = hashedPassword;
          console.log(password);
          const newUser = new Usermodel({ name, email, password, username });
          console.log(newUser);
          newUser.save();
        });

        res.redirect("/login");
      } else {
        res.redirect("");
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
      res.render("login");
      console.log(error);
    }
  },

  postlogin: async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
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
};
