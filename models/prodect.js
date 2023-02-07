const mongoose = require('mongoose');


const prodectschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }

 
})

const prodect= mongoose.model('prodects', prodectschema,'prodects');
module.exports = prodect;



