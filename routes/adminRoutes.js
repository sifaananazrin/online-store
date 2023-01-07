const express = require('express');
const path = require('path');
const cart = require("../models/carts");
const router = express.Router();
const controller = require('../controllers/adminControl');
const verifyLogin = require("../middleware/Session");

const multer  = require('multer')

const { storage } = require('../middleware/cloudinary');

// const storage = multer.diskStorage({
//     destination: (req, file,callback)=>{
//          callback(null, './public/images')
//     },
//     filename: (req, file, callback)=>{
//          console.log(file)
//          callback(null, Date.now()+ path.extname(file.originalname))
//     }
// })


const upload = multer({ storage })




router.route('/login').get(controller.adminLoginRender).post(controller.adminLoginPost);
router.get('/logout', controller.logout);
router.get('/home',controller.adminHomeRender);
router.get('/users',verifyLogin.adminSession, controller.adminUsersRender);
router.route('/edit/:id').get(verifyLogin.adminSession,controller.admin_edit_user).post(verifyLogin.adminSession,controller.edit_post);
router.get('/blockuser/:id', verifyLogin.adminSession,controller.blockUser);
router.get('/unblockuser/:id',verifyLogin.adminSession, controller.unblockUser);
router.get('/adminCategory',verifyLogin.adminSession, controller.getAdminCategory);
router.route('/addCategory').get(verifyLogin.adminSession,controller.getAddCategory).post(controller.postAddCategory);
router.get('/deleteCategory/:id', verifyLogin.adminSession,controller.getDeleteCategory);
router.route('/editCategory/:id').get(verifyLogin.adminSession,controller.getEditCategory).post(verifyLogin.adminSession,controller.postEditCategory);
router.get('/products', verifyLogin.adminSession,controller.getAdminProducts);
router.route('/addProduct').get(verifyLogin.adminSession,controller.getAddProduct).post( verifyLogin.adminSession,upload.array('image', 4),controller.postAddProduct);
router.route('/editProduct/:id').get(verifyLogin.adminSession,controller.getEditProduct).post(verifyLogin.adminSession,upload.array('image', 4),controller.postEditProduct);
router.get('/deleteProduct/:id', verifyLogin.adminSession,controller.getDeleteProduct);
router.get('/orders', verifyLogin.adminSession, controller.getOrders);
router.post('/changeStatus', verifyLogin.adminSession, controller.changeOrderStatus);
router.post('/orderCompleted', verifyLogin.adminSession, controller.orderCompeleted);
router.post('/orderCancel', verifyLogin.adminSession, controller.orderCancel);
router.get('/coupon', verifyLogin.adminSession, controller.getCoupon);
router.get('/addCoupon', verifyLogin.adminSession, controller.getAddCoupon);
router.post('/addCoupon', verifyLogin.adminSession, controller.postAddCoupon);
router.get('/deleteCoupon/:id', verifyLogin.adminSession, controller.getDeleteCoupon);
router.get('/salesReport', verifyLogin.adminSession, controller.getSalesReport);


router.get('/banner', verifyLogin.adminSession, controller.getBanner);
router.get('/addBanner', verifyLogin.adminSession, controller.getAddBanner);
router.post('/addBanner',upload.array('image', 4), verifyLogin.adminSession, controller.postAddBanner);
router.get('/deleteBanner/:id', verifyLogin.adminSession, controller.getDeleteBanner);

router.get('/blockproduct/:id', verifyLogin.adminSession,controller.blockproduct);
router.get('/unblockproduct/:id',verifyLogin.adminSession, controller.unblockproduct);
// router.get('/coupon', verifyLogin.adminSession, controller.getCoupon);
// router.get('/addCoupon', verifyLogin.adminSession, controller.getAddCoupon);
// router.post('/addCoupon', verifyLogin.adminSession, controller.postAddCoupon);
// router.get('/deleteCoupon/:id', verifyLogin.adminSession, controller.getDeleteCoupon);
// router.get('/salesReport', verifyLogin.adminSession, controller.getSalesReport);

module.exports = router;
