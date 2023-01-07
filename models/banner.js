const mongoose = require('mongoose');

const { Schema } = mongoose;
const BannerSchema = new Schema(
  {
    image: [
      {
        url: String,
        filename: String,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    description: {
        type: String,
        required: true,
      },
  },
  {
    timestamps: true,
  },
);

const Banners = mongoose.model('banner', BannerSchema);
module.exports = Banners;