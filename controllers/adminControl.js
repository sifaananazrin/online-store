/* eslint-disable no-console */
const moment = require('moment');
const Users = require('../models/signupModel');
const Categories = require('../models/categories');
const Products = require('../models/products');
const Orders = require('../models/orders');
const Coupons = require('../models/coupon');
const Banners=require('../models/banner');


require('dotenv/config');


let message = '';



const adminHomeRender = async (req, res) => {
  try {
   
    const userCount = await Users.countDocuments({});
    const productCount = await Products.countDocuments({});
    const orderData = await Orders.find({ orderStatus: { $ne: 'Cancelled' } });
    const orderCount = await Orders.countDocuments({});
    const pendingOrder = await Orders.find({ orderStatus: 'Pending' }).count();
    const completed = await Orders.find({ orderStatus: 'Completed' }).count();
    const delivered = await Orders.find({ orderStatus: 'Delivered' }).count();
    const cancelled = await Orders.find({ orderStatus: 'Cancelled' }).count();
    const cod = await Orders.find({ paymentMethod: 'cod' }).count();
    const online = await Orders.find({ paymentMethod: 'online' }).count();
 
    const totalAmount = orderData.reduce((accumulator, object) => {
    
      return (accumulator += object.totalAmount);
    }, 0);
    res.render('admin/adminHome', {
      usercount: userCount,
      productcount: productCount,
      totalamount: totalAmount,
      ordercount: orderCount,
      pending: pendingOrder,
      completed,
      delivered,
      cancelled,
      cod,
      online,
    });
  } catch (error) {
    res.redirect('/500');
  }
};



const adminLoginRender = (req, res) => {
  const { session } = req;
  if (session.userid && session.account_type === 'admin') {
    res.redirect('/admin/home');
  } else {
    res.render('admin/adminLogin', { message });
    message = '';
  }
};

const admin = "admin@gmail.com";
const mypassword = "123";
const adminLoginPost = (req, res) => {
  if (req.body.email == admin && req.body.password == mypassword) {
    const { session } = req;
    session.userid = admin;
    session.account_type = 'admin';
    res.redirect('/admin/home');
  } else {
    message = 'Invalid email or password';
    res.render('admin/adminLogin', { message });
  }
};


const adminUsersRender = async (req, res) => {
  const { session } = req;
  if (session.userid && session.account_type === 'admin') {
    const usersData = await Users.find();
    res.render('admin/userView', { users: usersData });
  } else {
    res.redirect('/admin/login');
  }
};



const admin_edit_user = (req, res) => {
  const session = req.session;
  if (session.userid && session.account_type == "admin") {
    const finding = Users.find({ _id: req.params.id })
      .then((result) => {
        const data = result;
        res.render("admin/editUser", { data });
      })
      .catch((err) => {y
        console.log(err);
      });
  } else {
    res.redirect("/");
  }
};

const edit_post = (req, res) => {
  console.log(req.body);
  const update = Users.findOneAndUpdate(
    { _id: req.params.id },
    {
        full_name: req.body.firstName,
       email: req.body.email,
      phone: req.body.phoneNumber,
     
    }
  )
    .then((result) => {
      console.log(result);
      message = "User data updated";
      res.redirect("/admin/users");
    })
    .catch((err) => {
      console.log(err);
    });
};


const blockUser = async (req, res) => {
  try {
    await Users.updateOne({ _id: req.params.id }, { $set: { isBlock: true } }).then(() => {
      res.redirect('/admin/users');
    });
  } catch (error) {
    console.log(error.message);
  }
};

const unblockUser = async (req, res) => {
  try {
    await Users.updateOne({ _id: req.params.id }, { $set: { isBlock: false } }).then(() => {
      res.redirect('/admin/users');
    });
  } catch (error) {
    console.log(error.message);
  }
};

const logout = (req, res) => {
  const { session } = req;
  session.destroy();
  // console.log('logout');
  res.redirect('/admin/login');
};

const getAdminCategory = async (req, res) => {
  const { session } = req;
  if (session.userid && session.account_type === 'admin') {
    try {
      const categories = await Categories.find();
      res.render('admin/categoryView', { categories });
    } catch (error) {
      console.log(error.message);
    }
  }
};



const getAddCategory = (req, res) => {
  const { session } = req;
  if (session.userid && session.account_type === 'admin') {
    res.render('admin/addCategory');
  } else {
    res.redirect('/admin/login');
  }
};

const postAddCategory = async (req, res) => {
  
  try {
   console.log(req.body)
   const category = await Categories.findOne({ name: req.body.cat });

   if (category) {

    res.redirect("/admin/addCategory");
    

   }else{

   
    var categories = new Categories({
      name: req.body.cat,
      description: req.body.des,
  
    
    
     
    });
   
  }
  var Data = await categories.save();
    if (Data){
      res.redirect('/admin/adminCategory');
    } else {
      res.render('admin/addCategory');
    }
  } catch (error) {
    console.log(error.message);
  }
};
  
  
  
 

const getEditCategory = async (req, res) => {
  const { session } = req;
  if (session.userid && session.account_type === 'admin') {
    const { id } = req.params;
    console.log(id);
    const categories = await Categories.findOne({ _id: id });
    res.render('admin/editCategory', { categoriesData: categories });
  } else {
    res.redirect('/admin/login');
  }
};

const postEditCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params.id);
    const categoriesData = await Categories.updateOne({ _id: id }, {
      name: req.body.cat,
      description: req.body.des,
    });
    if (categoriesData) {
      res.redirect('/admin/adminCategory');
    } else {
      res.render('admin/editCategory');
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await Categories.deleteOne({ _id: id }).then(() => {
      res.redirect('/admin/adminCategory');
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getAdminProducts = async (req, res) => {
  const { session } = req;
  if (session.userid && session.account_type === 'admin') {
    const productsData = await Products.find();
    res.render('admin/productView', { products: productsData });
  } else {
    res.redirect('/admin/login');
  }
};

const getAddProduct = async (req, res) => {
  const { session } = req;
  if (session.userid && session.account_type === 'admin') {
    const categories = await Categories.find();
    // console.log(categories);
    res.render('admin/addProduct', { categories });
  } else {
    res.redirect('/admin/login');
  }
};

const postAddProduct = async (req, res) => {
  try {
    const IMAGE_PATH = (req.file.path).slice(7)


    const products = new Products({
      item_name : req.body.item_name,
      des : req.body.des,
      price: req.body.price,
      category: req.body.category,
      stock:req.body.stock,
      soldCount: 10,
      discount: true,
      image:IMAGE_PATH,
     
    });
    const productsData = await products.save();
    if (productsData){
      res.redirect('/admin/products');
    } else {
      res.render('admin/addProduct');
    }
  } catch (error) {
    console.log(error.message);
  }
};




const getEditProduct = (req, res) => {
  const session = req.session;
  if (session.userid && session.account_type == "admin") {
    const finding = Products.find({ _id: req.params.id })
      .then((result) => {
        const data = result;
        res.render("admin/editProduct", { data });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/");
  }
};

const postEditProduct = (req, res) => {
  console.log(req.body);
  const update = Products.findOneAndUpdate(
    { _id: req.params.id },
    {
      item_name : req.body.item_name,
      des : req.body.des,
      price: req.body.price,
      category: req.body.cat,
      stock:req.body.qty,
      soldCount: 10,
     
    }
  )
    .then((result) => {
      console.log(result);
      message = "product data updated";
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};


const blockproduct = async (req, res) => {
  try {
    await Products.updateOne({ _id: req.params.id }, { $set: { isDeleted: true } }).then(() => {
      res.redirect('/admin/products');
    });
  } catch (error) {
    console.log(error.message);
  }
};

const unblockproduct = async (req, res) => {
  try {
    await Products.updateOne({ _id: req.params.id }, { $set: { isDeleted: false } }).then(() => {
      res.redirect('/admin/products');
    });
  } catch (error) {
    console.log(error.message);
  }
};



const getDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await Products.deleteOne({ _id: id }).then(() => {
      res.redirect('/admin/products');
    });
  } catch (error) {
    console.log(error.message);
  }
};


const getOrders = (req, res) => {
  try {
    Orders.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $lookup: {
          from: 'logins',
          localField: 'user_id',
          foreignField: '_id',
          as: 'userfields',
        },
      },
      {
        $lookup: {
          from: 'addresses',
          localField: 'address',
          foreignField: '_id',
          as: 'userAddress',
        },
      },
      {
        $unwind: '$userfields',
      },
    ]).then((result) => {
      console.log(result);
      res.render('admin/orders', { allData: result });
    });
  } catch (error) {
    res.redirect('/500');
  }
};


const changeOrderStatus = (req, res) => {
  try {
    const { orderID, paymentStatus, orderStatus } = req.body;
    Orders.updateOne(
      { _id: orderID },
      {
        paymentStatus, orderStatus,
      },
    ).then(() => {
      res.send('success');
    }).catch(() => {
      res.redirect('/500');
    });
  } catch (error) {
    res.redirect('/500');
  }
};

const orderCompeleted = (req, res) => {
  try {
    const { orderID } = req.body;
    Orders.updateOne(
      { _id: orderID },
      { orderStatus: 'Completed' },
    ).then(() => {
      res.send('done');
    });
  } catch (error) {
    res.redirect('/500');
  }
};

const orderCancel = (req, res) => {
  try {
    const { orderID } = req.body;
    Orders.updateOne(
      { _id: orderID },
      { orderStatus: 'Cancelled', paymentStatus: 'Cancelled' },
    ).then(() => {
      res.send('done');
    });
  } catch (error) {
    res.redirect('/500');
  }
};


const getSalesReport = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const endtoday = moment().endOf('day');
    const monthstart = moment().startOf('month');
    const monthend = moment().endOf('month');
    const yearstart = moment().startOf('year');
    const yearend = moment().endOf('year');
    const daliyReport = await Orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today.toDate(),
            $lte: endtoday.toDate(),
          },
        },
      },
      {
        $lookup:
              {
                from: 'logins',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user',
              },
      },

      {
        $project: {
          order_id: 1,
          user: 1,
          paymentStatus: 1,
          finalAmount: 1,
          orderStatus: 1,
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    console.log(daliyReport);
    const monthReport = await Orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: monthstart.toDate(),
            $lte: monthend.toDate(),
          },
        },
      },
      {
        $lookup:
              {
                from: 'logins',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user',
              },
      },

      {
        $project: {
          order_id: 1,
          user: 1,
          paymentStatus: 1,
          finalAmount: 1,
          orderStatus: 1,
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    const yearReport = await Orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: yearstart.toDate(),
            $lte: yearend.toDate(),
          },
        },
      },
      {
        $lookup:
              {
                from: 'logins',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user',
              },
      },
      {
        $project: {
          order_id: 1,
          user: 1,
          paymentStatus: 1,
          totalAmount: 1,
          orderStatus: 1,
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    res.render('admin/salesReport', { today: daliyReport, month: monthReport, year: yearReport });
  } catch (error) {
    res.redirect('/500');
  }
};


const getCoupon = async (req, res) => {
  try {
    const coupons = await Coupons.find();
    res.render('admin/coupon', { allData: coupons });
  } catch (error) {
    res.redirect('/500');
  }
};

const getAddCoupon = (req, res) => {
  try {
    res.render('admin/addCoupon');
  } catch (error) {
    console.log(error);
    res.redirect('/500');
  }
};

const postAddCoupon = async (req, res) => {
  try {
    const { code, offer, amount } = req.body;
    const already = await Coupons.find({ coupon_code: code });
    if (already.length !== 0) {
      
      res.redirect('/admin/addCoupon');
    } else {
    
      const Coupon = Coupons;
      const coupon = new Coupon({
        coupon_code: code,
        offer,
        max_amount: amount,
      });
      await coupon.save();
      res.redirect('/admin/coupon');
    }
  } catch (error) {
    res.redirect('/500');
  }
};

const getDeleteCoupon = (req, res) => {
  try {
    Coupons.findOneAndDelete({ _id: req.params.id })
      .then(() => {
        res.redirect('/admin/coupon');
      }).catch(() => {
        res.redirect('/500');
      });
  } catch (error) {
    res.redirect('/500');
  }
};
const getBanner = async (req, res) => {
  try {
    const banner = await Banners.find();
    res.render('admin/banner', { banner });
  } catch (error) {
    res.redirect('/500');
  }
};

const getAddBanner = (req, res) => {
  res.render('admin/addBanner');
};

const postAddBanner = async (req, res) => {
  try {
    const IMAGE_PATH = (req.file.path).slice(7)
    const Banner = new Banners({
      name: req.body.name,
      description: req.body.des,
      image:IMAGE_PATH,
    });
      const bannerData = await Banner.save();
    if (bannerData) {
      res.redirect('/admin/banner');
    } else {
      res.render('admin/addBanner');
    }
  } catch (error) {
    console.log(error.message);
  }
};



const getDeleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await Banners.deleteOne({ _id: id }).then(() => {
      res.redirect('/admin/banner');
    });
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = {
  adminHomeRender,
  adminLoginRender,
  adminLoginPost,
  adminUsersRender,
  blockUser,
  unblockUser,
  admin_edit_user,
  edit_post,
  getAdminCategory,
  getAddCategory,
  postAddCategory,
  getEditCategory,
  postEditCategory,
  getDeleteCategory,
  getAdminProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getDeleteProduct,
  getOrders,
  logout,
  changeOrderStatus,
  orderCancel,
  orderCompeleted,
  getSalesReport,
  getCoupon,
  getAddCoupon,
  postAddCoupon,
  getDeleteCoupon,
  getBanner,
  getAddBanner,
  postAddBanner,
  getDeleteBanner,
  unblockproduct,
  blockproduct,
};
