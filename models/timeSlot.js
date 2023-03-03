const mongoose = require("mongoose");

const timesloteschma = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },

  start: {
    type: String,
  },
  end: {
    type: String,
  },
  total: {
    type: Number,
  },
});
const timeslote = mongoose.model("timeslotes", timesloteschma);
module.exports = timeslote;
