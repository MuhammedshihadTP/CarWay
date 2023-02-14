const mongoose = require("mongoose");
const usersignup = require("./UserModel");

const bookingschma= new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      
  email: {
    type: String,
    required: true,
  },

  number:{
    type:Number,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  licn:{
    type:Number,
    required:true
  },
  post:{
    type:Number,
    required:true
  },
  daysnumber:{
    type:Number,
    required:true
  }
})

const booking= mongoose.model('booking',bookingschma);
module.exports=usersignup;