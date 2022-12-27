
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;
const cartSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    product: [
      {
        productId: {
          type: ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Carts = mongoose.model('cart', cartSchema);
module.exports = Carts;
