const mongoose = require("mongoose");
const vehicles = require("./vehicles");
const Cheackout = require("./CheackOut");

const userschema = new mongoose.Schema({
  name: {
    type: String,
  },

  username: {
    type: String,
  },

  email: {
    type: String,
  },

  password: {
    type: String,
  },

  block: {
    type: Boolean,
    default: true,
  },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  lice: {
    type: Number,
  },
  image: {
    type: String,
  },
  cart: {
    items: [
      {
        product_id: {
          type: String,
          ref: "vehicles",
        
        },
        Totalprice: {
          type: Number,
        
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
    // resetToken: String,
    // resetTokenExpiration: Date,
  },
});

userschema.methods.addCart = async function (prodect,prodectdetails) {
  console.log( prodect._id);
  let cart = this.cart;
  if (cart.items.length == 0) {
    cart.items.push({ prodect_id: prodect._id, price: prodectdetails.total });
    cart.totalPrice = prodectdetails.total;
  } else {
  }
  console.log("user in schma :", this);
  return this.save();
};

const usersignup = mongoose.model("signup", userschema, "signup");
module.exports = usersignup;
