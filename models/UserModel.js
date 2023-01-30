const mongoose = require('mongoose');


const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }
})

const usersignup = mongoose.model('signup', userschema);
module.exports = usersignup;



