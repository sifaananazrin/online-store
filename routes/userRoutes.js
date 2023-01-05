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
router.post('/store', controller.search);
router.get('/profile', verifyLogin.userSession, controller.getProfile);
router.get('/changePassword', verifyLogin.userSession, controller.getChangePassword);
router.post('/changePassword', verifyLogin.userSession, controller.postChangePasswod);
router.get('/addAddress', verifyLogin.userSession, controller.getaddAddress);
router.post('/addAddress', verifyLogin.userSession, controller.postaddAddress);
router.get('/editAddress/:id', verifyLogin.userSession, controller.getEditAddress);
router.post('/editAddress/:id', verifyLogin.userSession, controller.postEditAddress);
router.get('/deleteAddress/:id', verifyLogin.userSession, controller.getDeleteAddress);
router.post('/orderConfirmed', verifyLogin.userSession, controller.confirmOrder);
router.get('/orderSuccess', verifyLogin.userSession, controller.orderSuccess);
router.get('/orders', verifyLogin.userSession, controller.getOrders);
router.post('/verifyPayment', verifyLogin.userSession, controller.verifyPayment);
router.get('/paymentFail', verifyLogin.userSession, controller.paymentFailure);
router.get('/collection', verifyLogin.userSession, controller.allproduct);
router.post('/couponCheck', verifyLogin.userSession, controller.couponCheck);
router.get('/wishlist', verifyLogin.userSession, controller.getWishlist);
router.post('/addToWishlist', verifyLogin.userSession, controller.postAddToWishlist);
router.post('/deleteWishlist', verifyLogin.userSession, controller.postDeleteWishlist);




module.exports = router;   
