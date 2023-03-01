const mongoose = require("mongoose");
const vehicles = require("./vehicles");
const Cheackout = require("./CheackOut");

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  block: {
    type: Boolean,
    default: true,
  },
 phone:{
  type:Number

 },
 address:{
  type:String
 },
 lice:{
  type:Number
 },
 image:{
  type:String
 },


  cart: {
    items: [
      {
        product_id: {
          type: String,
          ref: "vehicles",
        },
        total: {
          type: Number,
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },
});

userschema.methods.addCart = async function (prodect) {
  let cart = this.cart;
  if (cart.items.length == 0) {
    cart.items.push({ product_id: prodect._id, total: 1 });
    cart.totalPrice = prodect.price;
  } else {
  }
  console.log("user in schma :");
};

const usersignup = mongoose.model("signup", userschema, "signup");
module.exports = usersignup;
