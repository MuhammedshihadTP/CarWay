const mongoose = require("mongoose");


const CheackoutSchma = new mongoose.Schema({
  name: {
    type: String,

  },

  email: {
    type: String,

  },
  vname: {
    type: String,

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


  amount: {
    type: Number,
  },
  start: {
    type: Date,

  },
  end: {
    type: Date,

  },

  isAvailable: {
    type: Boolean,
    default: true
  }

})

const Cheackout = mongoose.model('Cheackout', CheackoutSchma);
module.exports = Cheackout;