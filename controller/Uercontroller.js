const usersignup = require("../models/UserModel");
const Usermodel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { exists, rawListeners, find, findOne } = require("../models/UserModel");
const session = require("express-session");
const { render } = require("ejs");
const transporter = require("../mail/transporter");
const { default: mongoose } = require("mongoose");
const { query } = require("express");
const vehiclesmodel = require("../models/vehicles");
const { use } = require("../mail/transporter");
const auth = require("../middleware/auth");
const timeslotes = require("../models/timeSlot");
const CheackoutModal = require("../models/CheackOut");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  // Homepage Controller-----------------
  home: async (req, res) => {
    try {
      const userid = req.session.log;

      await Usermodel.findOne({ _id: userid }).then((user) => {
        res.render("user/home", { user });
      });
    } catch (error) {
      console.log(error);
    }
  },

  // Signup Controller.......
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

  // OTP verification----------------------------------------

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
  // Login Controllor------------------------------

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
      res.json({ msg: "Your  blocked" });
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
  // Prodect Controller------------------------------

  getproductdetails: async (req, res, auth) => {
    try {
      const id = req.params.id;
      console.log(id);

      const user = req.session.log;

      if (user) {
        console.log(id, "--------dddddd----");
        console.log(user);

        await vehiclesmodel.findById({ _id: id }).then((prodects) => {
          console.log(prodects, "hiptodet");
          res.cookie("poroduct_id", JSON.stringify(prodects._id).split('"')[1]);
          res.render("user/prodect", { prodects, user });
        });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error);
    }
  },

  // postsearch: async (req, res) => {
  //   try {

  //     console.log(req.query.q);

  //     const agg = [
  //       { $search: { autocomplete: { query: req.query.q, path: "name" } } },
  //       { $limit: 10 },
  //       { $project: { name: 1} },
  //     ];

  //     const result = await vehiclesmodel.aggregate(agg);
  //     console.log(result);
  //     res.json({ result });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  postbooking: async (req, res) => {
    console.log(
      req.body.id,
      "mmkjijiooiu------------------------------------------------"
    );

    const booking = new timeslotes({
      id: req.body.id,
      start: req.body.start,
      end: req.body.end,
      total: req.body.total,
      name: req.body.name,
    });

    booking
      .save()
      .then((data) => {
        console.log(data);
        res.cookie("booking_id", JSON.stringify(data._id).split('"')[1]);
        // res.send("booked")
        res.status(200).send("done");
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error saving user to database");
      });
  },

  getcheaackoutform: async (req, res, auth) => {
    try {
      const user = req.session.log;
      const username = req.session.log.name;
      const email = req.session.log.email;
      const cookiesid = req.cookies.booking_id;

      console.log(username, email);
      console.log(req.cookies.booking_id);
      const prodectId = await req.cookies.poroduct_id;
      console.log(prodectId, "______-------- ------------____");

      if (req.session.log) {
        const time = await timeslotes.findOne({ _id: cookiesid });
        const helooo = await vehiclesmodel.findById(prodectId);
        await vehiclesmodel.updateOne(helooo, {
          $set: {
            booked: true,
          },
        });
        console.log(helooo, "------------eqq-wqeqwe-ewq-");

        // const time = await timeslotes.findOne({ _id: cookiesid });
        console.log(time, "heloo");
        res.render("user/checkout", { user, email, time, username });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // PaymentControlller-------------------------------------

  postpayment: async (req, res) => {
    const { vehicles } = req.body;
    console.log(vehicles, "DONE");
    const cheack = new CheackoutModal(vehicles);
    cheack.save().then((result) => {
      // console.log(result);
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: vehicles.vname,
            },
            unit_amount: parseInt(vehicles.amount + "00"),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/Sucssus`,
      cancel_url: `${process.env.APP_URL}/failed`,
    });
    // console.log(session);
    // res.redirect(session.url)
    res.json({ url: session.url });
  },

  getsucssuse: async (req, res) => {
    try {
      res.render("user/Sucssus");
    } catch (error) {
      console.log(error);
    }
  },
  getfailed: async (req, res) => {
    try {
      res.render("user/failed");
    } catch (error) {
      console.log(error);
    }
  },

  //  CartntRoller----------------------

  postCart: async (req, res) => {
    try {
      console.log(req.body.id, "helloo--------------");
    const id = req.session.log._id;
     const Bprodect=req.body
     const user=await Usermodel.findById(id)
     let prodect=await vehiclesmodel.findById(req.body.id)
     console.log(prodect);
     await user.addCart(prodect,Bprodect)
     res.redirect("/home")
     
    
    } catch (error) {
      console.log(error);
    }
  },
  getcartpage: async (req, res) => {
    try {
      if (req.session.log) {
        const user = req.session.log;

        res.render("user/cart", { user });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error);
    }
  },

  // CarGrid---------------------

  getcargrid: async (req, res) => {
    try {
      if (req.session.log) {
        const user = req.session.log;
        const vehicles = await vehiclesmodel.find();
        res.render("user/prodeuctgrid", { vehicles, user });
      } else {
        res.redirect("/login");
      }
    } catch (error) {}
  },

  getavalabelcars: async (req, res) => {
    if (req.session.log) {
      const { startDate, endDate } = req.body;
      console.log(req.body);
      const user = req.session.log;
      const vehicles = await vehiclesmodel.find();
      CheackoutModal.find({
        availability: {
          $elemMatch: {
            start: { $lte: endDate },
            end: { $gte: startDate },
            isAvailable: true,
          },
        },
      })
        .then((availableCars) => {
          res.redirect("/cars");
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Internal server error");
        });
    } else {
      res.redirect("/login");
    }
  },

  // User_Profile-------------------------

  getprofilepage: async (req, res) => {
    try {
      const userid = req.params.id;
      const userdetailes = await Usermodel.findById({ _id: userid });
      res.render("user/profile", { userdetailes });
    } catch (error) {
      console.log(error);
    }
  },

  updateprofilepage: async (req, res) => {
    try {
      const userid = req.params.id;
      console.log(userid);
      console.log("shihad");
      await Usermodel.updateOne(
        { _id: userid },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            lice: req.body.lice,
            image: req.file.filename,
            address: req.body.address,
          },
        }
      ).then((result) => {
        console.log(result, ".l;lklkpoisdfg__________");
        res.redirect(`/profile/${userid}`);
      });
    } catch (error) {
      console.log(error);
    }
  },

  // Search_Product-----------------------------------

  search: async (req, res) => {
    try {
      const user = req.session.log;
      console.log(req.query.search);
      console.log();
      const agg = [
        {
          $search: { autocomplete: { query: req.query.search, path: "name" } },
        },
        { $limit: 10 },
        { $project: { name: 1 } },
      ];
      const result = await vehiclesmodel.aggregate(agg);
      console.log(result);
      const vehicleid = result.map((items) => items._id);
      console.log(vehicleid);
      const vehicles = await vehiclesmodel.find({ _id: vehicleid });
      console.log(vehicles);

      res.render("user/prodeuctgrid", { user, vehicles });
      // res.json({ result });
    } catch (error) {
      console.log(error);
    }
  },
};
