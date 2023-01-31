const usersignup = require("../models/UserModel");
const Usermodel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { exists } = require("../models/UserModel");
const session = require("express-session");

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
        bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
          req.body.password = hashedPassword;
          const newUser = new usersignup(req.body);
          console.log(newUser);
          newUser.save();
          res.redirect("/login");
        });
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
      res.status(401).json({ msg: "user nit founded" });
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
