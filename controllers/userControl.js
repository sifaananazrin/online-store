const mongoose = require('mongoose');
const Users = require("../models/signupModel");
const Categories = require('../models/categories');
const bcrypt = require("bcryptjs");
const Carts = require('../models/carts');
const Orders = require('../models/orders');
const nodemailer = require("nodemailer");
const Products = require("../models/products");

let message = "";
var email;

var mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shifananazrin15@gmail.com",
    pass: "qfqpdofyccxihrxh",
  },
});
const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;






const loginRender = (req, res) => {
  const session = req.session;
  const customer = false;
  if (session.userid) {
    res.redirect('/user/home');
  }
  res.render('user/login', { message, customer });
  message = '';
};


const loginPost = async (req, res) => {
  try {
   

    const email = req.body.email;
    const password = req.body.password;

    const user = await Users.findOne({ email: email }).then(async (userData) => {
      if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (passwordMatch) {
          // req.sessions.user_id = userData._id;

          if (userData.isBlock === false) {
            console.log(userData.isBlock);
            if (passwordMatch) {
              const { session } = req;
              session.account_type = "user";
              session.userid = userData._id;
              res.redirect("/user/home");
            } else {
              message = "wrong password";
              res.render("user/login", { message });
            }
          } else {
            message = "You are blocked";
            res.render("user/login", { message });
          }
        } else {
          message = "Register to continue";
          res.render("user/login", { message });
        }
      }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const userHomeRender = async (req, res) => {
    const { session } = req;
    let count = 0;
  
    const products = await Products.find().limit(3);
    const discounts = await Products.find({ discount: true });
    if (session.userid && session.account_type === 'user') {
      const userData = await Users.findOne({ _id: session.userid });
      const cart = await Carts.find({ userId: userData._id });
      if (cart.length) {
        count = cart[0].product.length;
      }
      const customer = true;
      res.render('user/userhome', { customer, products, count, discounts });
    } else {
      const customer = false;
      res.render('user/userhome', { customer, products, count, discounts });
    }
  };
  
  const getProductDetail = async (req, res) => {
    try {
      const { session } = req;
      const { id } = req.params;
      const products = await Products.findOne({ _id: id });
  
      if (session.userid && session.account_type === 'user') {
        let count = 0;
        const userData = await Users.findOne({ _id: session.userid });
        const cart = await Carts.find({ userId: userData._id });
  
        const customer = true;
        if (cart.length) {
          count = cart[0].product.length;
        } else {
          count = 0;
        }
        res.render('user/productView', { customer, products, count, session });
      } else {
        const count = null;
        const customer = false;
        res.render('user/productView', { customer, products, count, session });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

 



const logout = (req, res) => {
  const { session } = req;
  session.destroy();
  // console.log('logout');
  res.redirect("/");
};

const signupRender = (req, res) => {
  try {
    res.render("user/registerform", { message });
    message = "";
  } catch (error) {
    console.log(error);
  }
};

const signupPost = async (req, res) => {
  firstname = req.body.firstName;
  email = req.body.email;
  phone = Number(req.body.phoneNumber);
  password = req.body.password;
  let mailDetails = {
    from: "Shifananazrin15@gmail.com",
    to: email,
    subject: "ECOMERCE ACCOUNT REGISTRATION",
    html: `<p>YOUR OTP FOR REGISTERING IN ECOMERCE IS ${OTP}</p>`,
  };

  const user = await Users.findOne({ email: email });
  if (user) {
    res.render("user/registerform");
  } else {
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("Error Occurs,,,,");
      } else {
        console.log("Email Sent Successfully");
        res.redirect("/user/otp");
      }
    });
  }
};

const GetOtp = async (req, res) => {
  try {
    res.render("user/otp");
  } catch (error) {
    console.log(error.message);
  }
};

const PostOtp = async (req, res) => {
  let otp = req.body.otp;

  console.log(otp);
  console.log(OTP);
  if (OTP == otp) {
    // let password
    const hash = await bcrypt.hash(password, 10);
    const user = new Users({
      full_name: firstname,
      email: email,
      phone: phone,
      password: hash,
      account_type: "user",
    });

    user.save().then(() => {
      req.session.user_id = Users._id;
      res.render("user/successpage");
    });
  } else {
    console.log("otp error");
    res.redirect("/otp");
  }
};




const getCart = async (req, res) => {
  const { session } = req;
  const userData = mongoose.Types.ObjectId(session.userid);
  const customer = true;
  const cart = await Carts.aggregate([
    {
      $match: { userId: userData },
    },
    {
      $unwind: '$product',
    },
    {
      $project: {
        productItem: '$product.productId',
        productQuantity: '$product.quantity',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productItem',
        foreignField: '_id',
        as: 'productDetail',
      },
    },
    {
      $project: {
        productItem: 1,
        productQuantity: 1,
        productDetail: { $arrayElemAt: ['$productDetail', 0] },
      },
    },
    {
      $addFields: {
        productPrice: {
          $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
        },
      },
    },
  ]);

  const sum = cart.reduce((accumulator, object) => accumulator + object.productPrice, 0);
  const count = cart.length;
  res.render('user/cart', { session, customer, cart, count, sum });
};

const getAddToCart = async (req, res) => {
  const id = req.params.id;
  const userId = req.session.userid;
  const products = await Products.findOne({ _id: id });
  const userData = await Users.findOne({ _id: userId });
  const objId = mongoose.Types.ObjectId(id);

  // const idUser = mongoose.Types.ObjectId(userData._id);
  const proObj = {
    productId: objId,
    quantity: 1,
  };
  if (products.stock >= 1) {

    
    const userCart = await Carts.findOne({ userId: userData._id });
    if (userCart) {
      const proExist = userCart.product.findIndex((product) => product.productId == id);
      if (proExist !== -1) {
        await Carts.aggregate([
          {
            $unwind: '$product',
          },
        ]);
        await Carts.updateOne(
          { userId: userData._id, 'product.productId': objId },
          { $inc: { 'product.$.quantity': 1 } },
        );
        res.redirect(`/user/productDetail/${id}`);
      } else {
        Carts
          .updateOne({ userId: userData._id }, { $push: { product: proObj } })
          .then(() => {
            res.redirect(`/user/productDetail/${id}`);
          });
      }
    } else {
      const newCart = new Carts({
        userId: userData._id,
        product: [
          {
            productId: objId,
            quantity: 1,
          },
        ],
      });
      newCart.save().then(() => {
        // res.json({ status: true });
      });
    }
  } else {
    res.json({ stock: true });
  }
};

const cartQuantity = async (req, res, next) => {
  const data = req.body;
  data.count = Number(data.count);
  data.quantity = Number(data.quantity);
  const objId = mongoose.Types.ObjectId(data.product);
  const productDetail = await Products.findOne({ _id: data.product });
  if (
    (data.count == -1 && data.quantity == 1)
    || (data.count == 1 && data.quantity == productDetail.stock)
  ) {
    res.json({ quantity: true });
  } else {
    await Carts
      .aggregate([
        {
          $unwind: '$product',
        },
      ])
      .then(() => {
        Carts
          .updateOne(
            { _id: data.cart, 'product.productId': objId },
            { $inc: { 'product.$.quantity': data.count } },
          )
          .then(() => {
            res.json({ status: true });
            next();
          });
      });
  }
};

const postDeleteProduct = (req, res) => {
  const cartid = req.body.cart;
  const pid = req.body.product;
  Carts.updateOne(
    { _id: cartid },
    { $pull: { product: { productId: pid } } },
  ).then(() => {
    // console.log(cart);
    res.redirect('/user/cart');
  }).catch((error) => {
    console.log(error);
  });
};

const getCheckout = async (req, res) => {
  const { session } = req;
  const uid = mongoose.Types.ObjectId(session.userid);
  const customer = true;
  const cart = await Carts.aggregate([
    {
      $match: { userId: uid },
    },
    {
      $unwind: '$product',
    },
    {
      $project: {
        productItem: '$product.productId',
        productQuantity: '$product.quantity',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productItem',
        foreignField: '_id',
        as: 'productDetail',
      },
    },
    {
      $project: {
        productItem: 1,
        productQuantity: 1,
        productDetail: { $arrayElemAt: ['$productDetail', 0] },
      },
    },
    {
      $addFields: {
        productPrice: {
          $sum: { $multiply: ['$productQuantity', '$productDetail.cost'] },
        },
      },
    },
  ]);

  const sum = cart.reduce((accumulator, object) => accumulator + object.productPrice, 0);
  const count = cart.length;
  Address.find({ user_id: uid }).then((address) => {
    res.render('user/checkout', {
      allData: cart, count, sum, name: req.session.firstName, address, customer,
    });
  }).catch((e) => {
    console.log(e);
  });
};

const Getcategory = async (req, res) => {
  try {
    res.render("user/category");
  } catch (error) {
    console.log(error.message);
  }
};
const Getwish= async (req, res) => {
  try {
    res.render("user/wishlist");
  } catch (error) {
    console.log(error.message);
  }
};








module.exports = {
  loginRender,
  loginPost,
  logout,
  userHomeRender,
  getProductDetail,
  signupPost,
  signupRender,
  GetOtp,
  PostOtp,
  cartQuantity,
  postDeleteProduct,
  getCart,
  getAddToCart,
  getCheckout,
  Getcategory,
  Getwish,
  
 
 
};
