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

  start: {
    type: String,
 
  },
  end: {
    type: String,
   
  },
  amount:{
    type:Number,
  }
 
})

const Cheackout = mongoose.model('Cheackout', CheackoutSchma);
module.exports = Cheackout;