/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;
const wishlistSchema = new Schema(
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
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Wishlists = mongoose.model('wishlist', wishlistSchema);
module.exports = Wishlists;
