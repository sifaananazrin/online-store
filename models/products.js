const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProdectSchema = new Schema({
  item_name: {
    type: String,
    required: true,
  },
  des: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    min: 0,
    max: 250,
    required: true,
  },
  category: {
    type: String,
    ref: 'categories',
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  soldCount: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
 
});

const Products = mongoose.model("product", ProdectSchema);
module.exports = Products;
