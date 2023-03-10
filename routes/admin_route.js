const express=require("express");
const admin_route=express();
admin_route.set('views','./views/admin')
const auth=require('../middlewares/auth');
const upload=require('../middlewares/multer')



//Requiring Controllers Starts-----------------------------------------------

const adminController=require("../controllers/admin_controller")
const productController=require("../controllers/product_controller")
const categoryController=require("../controllers/category_controller")
const adsController=require("../controllers/Ads_controller")
const orderController=require("../controllers/order_controller")
const couponController=require("../controllers/coupon_controller")

//Requiring Controllers Ends-------------------------------------------------


// Routes Starts  -----------------------------------------------------------

//Admin -------
admin_route.get('/',auth.islogout,adminController.loadsignin);

admin_route.post('/',adminController.adminverify);

admin_route.get('/dashboard',auth.islogin,adminController.dashboard);



// products------
admin_route.get('/products',auth.islogin,productController.viewProduct);

admin_route.get('/addProducts',auth.islogin,productController.addProduct);

admin_route.post('/addProducts',upload.array('image',4),productController.insertProduct);

admin_route.get('/deleteProduct/:id',auth.islogin,productController.deleteProduct);
 
admin_route.get('/editProduct/:id',auth.islogin,productController.loadEditProduct);

admin_route.post('/editProduct/:id',productController.editProduct);

admin_route.get('/unlistProduct/:id',auth.islogin,productController.unlistProduct);

admin_route.get('/listProduct/:id',auth.islogin,productController.listProduct);

      //edit Product Image
admin_route.post('/editImage/:id',upload.array('image',4),auth.islogin,productController.loadEditImage);

admin_route.get('/deleteImage/:id/:imgId',auth.islogin,productController.deleteProductImage);
     


//Users---------
admin_route.get('/users',auth.islogin,adminController.viewUser);

admin_route.get('/blockUser/:id',auth.islogin,adminController.blockUser);

admin_route.get('/unblockUser/:id',auth.islogin,adminController.unBlockUser);


//categories----
admin_route.get('/category',auth.islogin,categoryController.viewCategory);

admin_route.get('/addCategory',auth.islogin,categoryController.addCategory);

admin_route.post('/addCategory',categoryController.insertCategory);

admin_route.get('/deleteCategory/:id',auth.islogin,categoryController.deleteCategory);

admin_route.get('/editCategory/:id',auth.islogin,categoryController.EditCategory);

admin_route.post('/editCategory/:id',categoryController.editedCategory);


//Orders---------
admin_route.get('/orders',auth.islogin,adminController.viewOrder);

admin_route.post('/change-order-status',adminController.dropdown);

admin_route.get('/viewOrderDetails/:id',auth.islogin,orderController.loadViewOrder);



// Banners---------
admin_route.get('/addAdds',auth.islogin,adsController.addAdds);

admin_route.post('/addAdds',upload.array('image',1),adsController.insertAdds);

admin_route.get('/editAdd/:id',auth.islogin,adsController.loadEditBanner);

admin_route.post('/editAdd/:id',upload.array('image',1),adsController.saveEditBanner);

admin_route.get('/deleteadd/:id',auth.islogin,adsController.deleteAdd);
 
admin_route.get('/ads',auth.islogin,adsController.loadAds);


//Sales---------
admin_route.post('/salesReports',auth.islogin,adminController.salesReport);
admin_route.get('/salesReports',auth.islogin,adminController.salesReports);


//Coupons-------
admin_route.get('/coupons',auth.islogin,couponController.loadCoupons)

admin_route.get('/addCoupons',auth.islogin,couponController.loadAddCoupon)

admin_route.post('/addCoupons',couponController.insertCoupon)

admin_route.get('/deleteCoupon/:id',auth.islogin,couponController.deleteCoupon)

admin_route.get('/EditCoupon/:id',auth.islogin,couponController.EditCoupon);

admin_route.post('/EditCoupon/:id',auth.islogin,couponController.SaveCoupon);


//logout--------
admin_route.get('/logout',auth.islogin,adminController.logOut);


// Routes Ends  -----------------------------------------------------------


module.exports=admin_route;