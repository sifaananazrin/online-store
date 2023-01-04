const mongoose = require('mongoose');

const { Schema } = mongoose;
const CouponSchema = new Schema({
  coupon_code: {
    type: String,
    required: true,
  },
  offer: {
    type: String,
    required: true,
  },
  max_amount: {
    type: String,
    required: true,
  },
  coupon_status: {
    type: String,
    default: 'Active',
  },
  used_user_id: [String],
});

const Coupons = mongoose.model('coupon', CouponSchema);
module.exports = Coupons;