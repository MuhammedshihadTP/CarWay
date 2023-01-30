const mongoose=require('mongoose');

const userschema= new mongoose.Schema ({
    name: {
        type: String,
        required: true
      },

        username: {
        type: Number,
        required: true
      },
   
      email: {
        type: String,
        required: true
      },
     
      password: {
        type: Number,
        required: true
      }
     
})

const usersignup=mongoose.model('signup',userschema);
module.exports=usersignup