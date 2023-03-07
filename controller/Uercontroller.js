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

const coupun = require("../models/coupenmodel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order");

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
      const Bprodect = req.body;
      console.log(Bprodect);
      const user = await Usermodel.findById(id);
      let prodect = await vehiclesmodel.findById(req.body.id);
      console.log(prodect, "-----------------------");
      await user.addCart(prodect, Bprodect);
      res.redirect("/cart");
    } catch (error) {
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

        const Coupons = await coupun.find({
          Available: { $gt: 0 },
        });
        // res.send(CoupenData);
        console.log(cartz);
        res.render("user/cart", { user, cartz, Coupons });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
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

    console.log(
      Userfind.cart.totalPrice,
      "shihaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad"
    );


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
      console.log(Code, Totale, UserId, "helooCoupen----------------");
      if (Code !== "") {
        const coupons = await coupun.findOne({ code: Code });
        if (!coupons) {

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
          User.cart.totalPrice -= disCountRate[0].amount
          await User.save()
          console.log(User.cart.totalPrice);
        }

      }

    } catch (error) { }
  },

  CartCheackOut: async (req, res) => {
    try {
      const UserId = req.session.log._id
      const useer = await Usermodel.findOne({ _id: UserId }).populate('cart.items.productId')
      console.log(useer,);
      res.render("user/cartCheackout", { useer })

    } catch (error) {

    }

  },

  PaymentCheacOut: async (req, res) => {
    try {
      // console.log(object);
      const { Product } = req.body
      const paramsId = req.params.id
      console.log(paramsId, "================Params");

      console.log(Product, "--------------------------");
      const UserId = Product.id
      const address = Product.address
      const email = Product.email
      const lice = Product.lice
      console.log(address);
      const useer = await Usermodel.findOne({ _id: UserId })
      console.log(useer, "------------");
      const proDetails = useer.cart;
      const orderDeatails = {
        user_Id: UserId,
        address: address,
        email: email,
        lice: lice,
        cart: proDetails,
      }
      const order = new Order(orderDeatails)
      await order.save()
      console.log(order);
      console.log(paramsId, "90");
      const Data = proDetails.items.map(({ vname }) => vname).join(',');
      console.log(Data);
      const idd=proDetails.items.map(({productId})=>productId);
      console.log(idd);

    //  const vId= await vehiclesmodel.find({ productId: { $in: idd } })
    
     const result = await vehiclesmodel.updateMany(
      { _id: { $in: idd } },
      { $set: { booked: true } } 
    )

    console.log(result,"gotit");



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
        success_url: `${process.env.APP_URL}/Sucssus`,
        cancel_url: `${process.env.APP_URL}/failed`,
      });

      res.json({ url: session.url });
      useer.cart.items = []
      useer.cart.totalPrice = null
      await useer.save()
    } catch (error) {
      console.log(error);

    }
  },


  getsucssuse: async (req, res) => {
    try {
      res.render("user/Sucssus");
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
    } catch (error) { }
  },

  getavalabelcars: async (req, res) => {
    if (req.session.log) {
      const { startDate, endDate } = req.body;
      console.log(req.body);
      const user = req.session.log;
      const vehicles = await vehiclesmodel.find();
      res.redirect('/cars')

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

  myBookings:async(req,res)=>{
    try {
      const UserId=req.session.log._id;
      const order= await Order.find({user_Id:UserId})
     res.render("user/orders",{order})

    } catch (error) {
      console.log(error);
    }
  }
};
