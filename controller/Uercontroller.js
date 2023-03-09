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
const coupun = require("../models/coupenmodel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order");
const { findById } = require("../models/vehicles");

module.exports = {

  // Homepage Controller-----------------

  home: async (req, res) => {
    try {
      const userid = req.session.log;


      await Usermodel.findOne({ _id: userid }).then((user) => {
        let cartLength = 0
        if (user) {
          cartLength = user.count();
        }
        ;
        res.render("user/home", { user, cartLength });
      });
    } catch (error) {
      res.redirect("/error");
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
      res.redirect("/error");
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
    } catch (error) {
      res.redirect("/error")
    }
  },

  otpverification: async (req, res) => {
    try {
      console.log(req.session.signup);


      let { name, email, password, username, Token } = req.session.signup;
      if (req.body.otp == Token) {

        bcrypt.hash(password, 10).then((hashedPassword) => {
          password = hashedPassword;

          const newUser = new usersignup({ name, email, password, username });

          newUser.save();
        });

        res.redirect("/login");
      } else {
        res.redirect("/otp");
      }
    } catch (error) {
      res.redirect("/error")
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
      res.redirect("/error");
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
        await vehiclesmodel.findById({ _id: id }).then((prodects) => {
          console.log(prodects, "hiptodet");
          res.cookie("poroduct_id", JSON.stringify(prodects._id).split('"')[1]);
          res.render("user/prodect", { prodects, user });
        });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      res.redirect("/error")
      console.log(error);
    }
  },

  //  CartntRoller----------------------

  postCart: async (req, res) => {
    try {
     
      const id = req.session.log._id;
      const Bprodect = req.body;
      console.log(Bprodect);
      const user = await Usermodel.findById(id);
      let prodect = await vehiclesmodel.findById(req.body.id);
      await user.addCart(prodect, Bprodect);
      res.redirect("/cart");
    } catch (error) {
      res.redirect("/error")
      console.log(error);
    }
  },
  showCart: async (req, res) => {
    try {
      if (req.session.log) {
        const user = req.session.log;
        const userId = req.session.log._id;
        const findUser = await Usermodel.findById(userId);
        const cartz = await findUser.populate("cart.items.productId");

        let cartLength = 0;
        if (findUser) {
          cartLength = findUser.count();
        }

        const Coupons = await coupun.find({
          Available: { $gt: 0 },
        });
        // res.send(CoupenData);
        console.log(cartz);
        res.render("user/cart", { user, cartz, Coupons, cartLength });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      res.redirect("/error")
      console.log(error);
    }
  },

  Remoecart: async (req, res) => {
    const cartId = req.params.id;
    console.log(cartId);
    const userId = req.session.log._id;
    const productz = await vehiclesmodel.findById({ _id: cartId });
    const Userfind = await Usermodel.findById(userId);

    const index = await Userfind.cart.items.findIndex(
      (obj) => obj.productId == cartId
    );
    let value = null;
    if (index >= 0) {
      value = Userfind.cart.items[index].Trate;
    }

    const PricE = Userfind.cart.totalPrice;

    

    await Usermodel.updateOne(
      { _id: userId },
      { $pull: { "cart.items": { productId: cartId } } }
    );
    Userfind.cart.totalPrice = PricE - value;
    await Userfind.save();
    res.redirect("/cart");
  },

  CoupencheackOut: async (req, res, next) => {
    try {
      const UserId = req.session.log._id;
      const { Code } = req.body.Coupen;
      const { Totale } = req.body.Coupen;
     
      if (Code !== "") {
        const coupons = await coupun.findOne({ code: Code });
        if (!coupons) {
          req.flash('error', "invalid Coupen");
          console.log("cod inavlid");
        }
        const index = await coupons.userUsed.findIndex(
          (obj) => obj.userId == UserId
        );
        if (index >= 0) {
          console.log("user exist");
        } else {
          await coupun.updateOne(
            { code: Code },
            { $push: { userUsed: { userId: UserId } } }
          );
          const disCountRate = await coupun.find({ code: Code });
          const User = await Usermodel.findOne({ _id: UserId });
          if (!User) {
            console.log("User Not Found");
          }
          console.log(disCountRate[0].amount, "-----------------");
          User.cart.totalPrice -= disCountRate[0].amount;
          await User.save();
          console.log(User.cart.totalPrice);
        }
      }
    } catch (error) {
      res.redirect("/error")
     }
  },
  CartCheackOut: async (req, res) => {
    try {
      const UserId = req.session.log._id;
      const useer = await Usermodel.findOne({ _id: UserId }).populate(
        "cart.items.productId"
      );
      console.log(useer);
      res.render("user/cartCheackout", { useer });
    } catch (error) { }
  },
  PaymentCheacOut: async (req, res) => {
    try {
      // console.log(object);
      const { Product } = req.body;
      const paramsId = req.params.id;
      const UserId = Product.id;
      const address = Product.address;
      const email = Product.email;
      const lice = Product.lice;
      console.log(address);
      const useer = await Usermodel.findOne({ _id: UserId });
      const proDetails = useer.cart;
      const Data = proDetails.items.map(({ vname }) => vname).join(",");
      console.log(Data);
      const metadata = {
        user_Id: UserId,
        address: address,
        email: email,
        lice: lice,
        total_price: proDetails.totalPrice,
      };
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: Data,
              },
              unit_amount: parseInt(proDetails.totalPrice + "00"),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL}/Sucssus?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/failed`,
        metadata: metadata,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.log(error);
    }
  },

  getsucssuse: async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        req.query.session_id
      );
      if (session.payment_status === "paid") {
        const Product = session.metadata;
        const UserId = Product.user_Id;
        const address = Product.address;
        const email = Product.email;
        const lice = Product.lice;
     
        const useer = await Usermodel.findOne({ _id: UserId });
       
        const proDetails = useer.cart;
        const orderDeatails = {
          user_Id: UserId,
          address: address,
          email: email,
          lice: lice,
          cart: proDetails,
        };
        const order = new Order(orderDeatails);
        await order.save();
        console.log(order);
        const Data = proDetails.items.map(({ vname }) => vname).join(",");
       ;
        const idd = proDetails.items.map(({ productId }) => productId);
       
        const result = await vehiclesmodel.updateMany(
          { _id: { $in: idd } },
          { $set: { booked: true } }
        );
       
        useer.cart.items = [];
        useer.cart.totalPrice = null;
        await useer.save();
        res.render("user/Sucssus");
      } else {
        res.redirect("/failed");
      }
    } catch (error) {
      res.redirect("/error")
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

  // CarGrid---------------------

  getcargrid: async (req, res) => {
    try {
      if (req.session.log) {
        const user = req.session.log;
        const UserId = req.session.log._id;
        const Useer = await Usermodel.findById(UserId)
        let cartLength = 0;
        if (Useer) {
          cartLength = Useer.count();
        }
        const vehicles = await vehiclesmodel.find();
        res.render("user/prodeuctgrid", { vehicles, user, cartLength });
      } else {
        res.redirect("/login");
      }
    } catch (error) { }
  },

  getavalabelcars: async (req, res) => {
    if (req.session.log) {
      const { startDate, endDate } = req.body;
      console.log(req.body);
      const user = req.session.log;
      const vehicles = await vehiclesmodel.find();
      res.redirect("/cars");
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
        res.redirect(`/profile/${userid}`);
      });
    } catch (error) {
      res.redirect("/error")
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
      const UserId = req.session.log._id;
      const useer= await Usermodel.findById({_id:UserId});
      let cartLength = 0;
      if (useer) {
        cartLength = useer.count();
      }
      

      res.render("user/prodeuctgrid", { user, vehicles,cartLength});
      // res.json({ result });
    } catch (error) {
      console.log(error);
    }
  },
  myBookings: async (req, res) => {
    try {
      const UserId = req.session.log._id;
      if (req.session.log) {
        const order = await Order.find({ user_Id: UserId }).populate("cart.items.productId");
        res.render("user/orders", { order });
      } else {
        res.redirect("/login")
      }
    } catch (error) {
      res.redirect("/error")
      console.log(error);
    }
  },
  forgetPassword: async (req, res) => {
    try {
      res.render("user/forgetPass");
    } catch (error) {
      res.redirect("/error")
      console.log(error);
    }
  },
  postforgetPassword: async (req, res) => {
    try {
      const email = req.body.email;
      await Usermodel.findOne({ email: email }).then((users) => {
        if (users) {
          res.redirect("/");
          transporter.sendMail({
            to: [users.email],
            from: "carway@gmail.com",
            subject: "Password Reset",
            html: `<h4>To reset Your Password <a href="${process.env.APP_URL}/resetPassword/${users._id}">Click Here</a>`,
          });
        } else {
          res.redirect("/forgetpassword");
        }
      });
    } catch (error) {
      res.redirect("/error")
      console.log(error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const authId = req.params.id;
      await Usermodel.findOne({ _id: authId }).then((auth) => {
        res.render("user/resetPassword", { auth });
      });
    } catch (error) {
      res.redirect("/error")
      console.log(error);
    }
  },

  postresetPassword: async (req, res) => {
    try {
      const auth = req.body.userid;
      const pass = req.body.password;
      const hash = await bcrypt.hash(pass, 10);
      const user = await Usermodel.findOne({ _id: auth });
      await Usermodel.updateOne(
        { _id: auth },
        { $set: { password: hash } },
        { new: true }
      ).then((result) => {
        console.log(result, "password update");
        res.redirect("/login");
        transporter.sendMail({
          to: [user.email],
          from: "carway@gmail.com",
          subject: "Status Of reset Password",
          html: `<h2>Your Password Is Successfully Updated</h2>`,
        });
      });
    } catch (error) {
      res.redirect("/error")
      console.log(error);
    }
  },

  error: async (req, res) => {
    try {
      res.render("user/404")

    } catch (error) {
      console.log(error);

    }

  }
};
