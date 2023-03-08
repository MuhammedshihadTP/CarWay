const mongoose=require('mongoose');
const { schema } = require('./UserModel');

const adminschma= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

})

const adminsignup=mongoose.model("adminsignup",adminschma,"adminsignup");
module.exports=adminsignup