/* eslint-disable no-console */
const Users = require('../models/signupModel');
const Categories = require('../models/categories');
const Products = require('../models/products');
const cart = require("../models/carts");


require('dotenv/config');


let message = '';





const adminHomeRender = (req, res) => {
  const { session } = req;
  if (session.userid && session.account_type === 'admin') {
    res.render('admin/adminHome');
  } else {
    res.redirect('/admin/login');
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
      .catch((err) => {
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
  logout,
};
