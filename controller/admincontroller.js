const adminmodel=require('../models/adminmodel');
const bcrypt=require('bcrypt');




module.exports={
    adminhome:async(req,res)=>{
        try {
            if(req.session.admin){
                res.render('admindshbord');

            }
           
          
            
        } catch (error) {
            
        }

    },
    getsignup:async(req,res)=>{
        
        res.render('adminsignup');

    },

    postsignup:async(req,res)=>{
        try {
            const email=req.body.email;
            const adminexist=await adminmodel.findOne({email:email});
            if(adminexist){
                return res.status(400).json({msg:"email already exist"});
            }else{
                let password=req.body.password;
                bcrypt.hash(password, 10).then((hashedPassword)=>{
                    password=hashedPassword;
                    console.log(password);

                const newadmin= new adminmodel(req.body);
                console.log(newadmin);
                newadmin.save();
                res.redirect('/admin')
                });

             

            }
            
        } catch (error) {
            
        }
    }
}