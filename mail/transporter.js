const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:587,
    secure: true,
    service : 'Gmail',
    
    auth: {
      user: 'muhammedshihad09@gmail.com',
      pass:'urynavzdemabylwv'
    }
})


module.exports=transporter;