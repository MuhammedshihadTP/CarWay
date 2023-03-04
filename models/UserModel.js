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
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "vehicles",
          // required:true
        },
        price: {
          type: Number,
        },

        Trate: {
          type: Number,
        },

        strattime: {
          type: String,
        },
        endtime: {
          type: String,
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
  },
});

userschema.methods.addCart = async function (prodect, timeslo) {
  console.log(prodect._id);
  let cart = this.cart;
  // if (cart.items.length == 0) {
  //   cart.items.push({ productId:prodect._id, price:prodect.price});
  //   cart.totalPrice =timeslo.total;
  // } else {
  // }

  const isExisting = cart.items.findIndex(
    (objItems) => objItems.productId == prodect._id
  );
  const product = await vehicles.findOne({ _id: prodect._id });
  console.log(product);
  if (isExisting >= 0) {
    cart.items[isExisting].qty += 1;
  } else {
    cart.items.push({
      productId: prodect._id,
      price: prodect.price,
      strattime: timeslo.start,
      endtime: timeslo.end,
      Trate: timeslo.total,
    });
  }
  if (!cart.totalPrice) {
    cart.totalPrice = 0;
  }
  cart.totalPrice += timeslo.total;
  console.log("user in schma :", this);

  return this.save();
};

const usersignup = mongoose.model("signup", userschema, "signup");
module.exports = usersignup;
