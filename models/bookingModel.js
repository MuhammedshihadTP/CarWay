const mongoose = require("mongoose");


const bookingschma = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  vehiclename: {
    type: String,
    required: true
  },

  number: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  licn: {
    type: Number,
    required: true
  },
  post: {
    type: Number,
    required: true
  },
  starttime: {
    type: String,
    required: true
  },
  endtime: {
    type: String,
    required: true
  },
 
})

const booking = mongoose.model('booking', bookingschma,"booking");
module.exports = booking