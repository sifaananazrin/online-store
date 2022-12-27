const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoriedata = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
 
 
});

const categories = mongoose.model("Categories", categoriedata);
module.exports = categories;
