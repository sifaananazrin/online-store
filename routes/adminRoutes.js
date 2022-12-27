const express = require('express');
const path = require('path');
const cart = require("../models/carts");
const router = express.Router();
const controller = require('../controllers/adminControl');
const verifyLogin = require("../middleware/Session");

const multer  = require('multer')


const storage = multer.diskStorage({
    destination: (req, file,callback)=>{
         callback(null, './public/images')
    },
    filename: (req, file, callback)=>{
         console.log(file)
         callback(null, Date.now()+ path.extname(file.originalname))
    }
})


const upload = multer({ storage: storage })




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
router.route('/addProduct').get(verifyLogin.adminSession,controller.getAddProduct).post( verifyLogin.adminSession,upload.single("image"),controller.postAddProduct);
router.route('/editProduct/:id').get(verifyLogin.adminSession,controller.getEditProduct).post(verifyLogin.adminSession, upload.single("image"),controller.postEditProduct);
router.get('/deleteProduct/:id', verifyLogin.adminSession,controller.getDeleteProduct);

module.exports = router;
