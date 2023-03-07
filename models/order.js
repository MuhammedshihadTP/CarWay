const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  user_Id: {
    type: String,
    ref: 'signup',

  },
  address: {
    type: String,

  },
  email: {
    type: String,

  },
  lice: {
    type: String,

  },
  cart: {
    items: [{
      productId: {
        type: mongoose.Types.ObjectId,
        ref: 'vehicles'
      },
      strattime: {
        type: String,
      },
      endtime: {
        type: String,
      },
      vname:{
        type:String
      }
    }
    ],
    totalPrice: Number
  },
},
  { timestamps: true }
)


module.exports = mongoose.model('order', orderSchema)