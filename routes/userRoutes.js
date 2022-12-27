const express = require('express');

const router = express.Router();
const controller = require('../controllers/userControl');
const cart = require("../models/carts");
const verifyLogin = require("../middleware/Session");



router.get('/login', controller.loginRender);
router.post('/login', controller.loginPost);
router.get('/logout', controller.logout);
router.get('/signup', controller.signupRender);
router.post('/signup', controller.signupPost);
router.get('/home',controller.userHomeRender);

router.get('/otp',controller.GetOtp)
router.post('/otp', controller.PostOtp) 

router.get('/productDetail/:id', controller.getProductDetail);
router.get('/checkout', verifyLogin.userSession, controller.getCheckout);
router.get('/addToCart/:id', verifyLogin.userSession,controller.getAddToCart);
router.get('/cart',verifyLogin.userSession, controller.getCart);

router.post('/cartQuantity', verifyLogin.userSession, controller.cartQuantity);
router.post('/deleteProduct', verifyLogin.userSession, controller.postDeleteProduct);
router.get('/category',controller.Getcategory)
router.get('/wishlist',controller.Getwish)





module.exports = router;   
