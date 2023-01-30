const usersignup = require('../models/UserModel');
const Usermodel=require('../models/UserModel')


module.exports={
    home:(req,res)=>{
        res.render("home")

    },

    getsignup:(req,res)=>{
        res.render('signup');
    },

    postsignup:(req,res)=>{
        const newUser= new usersignup({
            email:req.body.name,
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,

        });

        newUser.save().then((result)=>{
            res.redirct('home')
            console.log(result);
    })



            
    }



}