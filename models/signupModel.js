const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const signUpSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  account_type: {
    type: String,
    required: true,
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
});

const Users = mongoose.model("login", signUpSchema);
module.exports = Users;
