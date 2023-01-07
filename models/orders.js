const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;
const orderSchema = new Schema({
  order_id: {
    type: String,
    unique: true,
    required: true,
  },
  user_id: {
    type: ObjectId,
    required: true,
  },
  address: {
    type: ObjectId,
    required: true,
  },
  products: [
    {
      productId: {
        type: ObjectId,
        required: true,
        ref: 'products',
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  expectedDelivery: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    default: 'Pending',
  },
  order_placed_on: {
    type: String,
    required: true,
  },

}, { timestamps: true });

const Orders = mongoose.model('order', orderSchema);
module.exports = Orders;