const mongoose = require("mongoose");

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
    default:true,
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

});

const usersignup = mongoose.model("signup", userschema, "signup");
module.exports = usersignup;
