const mongoose = require("mongoose");
const vehiclesschma = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Rcnumber: {
    type: String,
    
  },
  modelname: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  moredetails: {
    type: String,
    required: true,
  },
});

const vehicles = mongoose.model("vehicles", vehiclesschma, "vehicles");
module.exports = vehicles;
