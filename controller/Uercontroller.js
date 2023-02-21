const usersignup = require("../models/UserModel");
const Usermodel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { exists, rawListeners, find, findOne } = require("../models/UserModel");
const session = require("express-session");
const { render } = require("ejs");
const transporter = require("../mail/transporter");
const { default: mongoose } = require("mongoose");
const prodect = require("../models/prodect");
const { query } = require("express");
const vehiclesmodel = require("../models/vehicles");
const { use } = require("../mail/transporter");
const booking = require("../models/bookingModel");
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  home: async (req, res) => {
    try {
      const userid = req.session.log;
      const vehicles = await vehiclesmodel.find();
      await Usermodel.findOne({ _id: userid }).then((user) => {
        res.render("user/home", { user, vehicles });
      });
    } catch (error) {
      console.log(error);
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
    } catch (error) {}
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
    if (user && user.block) {
      bcrypt.compare(password, user.password).then((isvalid) => {
        if (isvalid) {
          req.session.log = user;
          res.redirect("/home");
        } else {
          res.redirect("/login");
        }
      });
    } else {
      res.json({ msg: "Your is blocked" });
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
      const id = req.params.id;
      console.log(id);

      const user = req.session.log;

      if (user) {
        console.log(id, "--------dddddd----");
        console.log(user);

        let prodects = await vehiclesmodel.findById({ _id: id });
    

        console.log(prodects, "hiptodet");
        res.render("user/prodect", { prodects, user});
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
      res.json({ result });
    } catch (error) {
      console.log(error);
    }
  },

  getbookingform: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const user = req.session.log;
      if (req.session.log) {
        await vehiclesmodel.findOne({ _id: id }).then((result) => {
          console.log(result);
          res.render("user/checkout", { result, user });
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  postbooking: async (req, res) => {
    try {
      const {
        name,
        email,
        number,
        address,
        licn,
        post,
        starttime,
        endtime,
        vehiclename,
      } = req.body;
      console.log(req.body);
      const bookings = new booking(req.body);
      await bookings.save();
    } catch (error) {}
  },

  postpayment: async (req, res) => {
    const { vehicles } = req.body;
    console.log(req.body)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: vehicles.name
              
            },
            unit_amount: parseInt(vehicles.amount + '00'),
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/Sucssus.ejs`,
      cancel_url: `${process.env.APP_URL}/failed.ejs`,
    });
    console.log(session);
    res.json({id:session.url});
  },
};
