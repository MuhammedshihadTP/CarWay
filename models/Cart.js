const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let CartSchema = new Schema({
vehicles:[{
    vehicle:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vehicles"
    },

    price:Number,
    name:String

}],
carttotal:Number,
totalafterdiscount:Number,
orderdby:{

    type:mongoose.Schema.Types.ObjectId,
    ref:"signup"
},

})
module.exports = mongoose.model('cart', CartSchema);