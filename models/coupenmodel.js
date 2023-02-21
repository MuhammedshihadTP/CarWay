const mongoose=require("mongoose");


const coupenschema= new  mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true
      },
      Available: {
        type: Number
      },
      Status: {
        type: String,
        default: 'Active'
      },
      amount: {
        type: Number,
        required: true
      },
      expireAfter: {
        type:String
      },
      usageLimit: {
        type: Number
      },
      minCartAmount: {
        type: Number
      },
      // maxDiscountAmount: {
      //   type: Number
      // }
});

const coupen=mongoose.model("coupen",coupenschema,"coupen");
module.exports=coupen;

