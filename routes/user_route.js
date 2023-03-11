const express=require("express");
const user_route=express();
const path=require("path");

const moment=require('moment');

const auth=require('../middlewares/userauth');

// user_route.set('view engine','ejs');
user_route.set('views','./views/user')


const userController=require("../controllers/user_controller")
const cartController=require("../controllers/cart_controller");
const wishlistController=require("../controllers/wishlist_controller");
const orderController=require("../controllers/order_controller");
const couponController=require("../controllers/coupon_controller");
const productController=require("../controllers/product_controller")
const { compileFunction } = require("vm");

//get home
user_route.get('/',userController.userLoad);

//get login
user_route.get('/login',auth.islogout,userController.loadLogin)

user_route.post('/login',userController.loginCheck)

//get signup
user_route.get('/signup',auth.islogout,userController.loadSignup)

user_route.post('/signup',userController.verifySignup)

//post otp
user_route.post('/verifyotp',userController.verifyOtp)


//vie products page
user_route.get('/products/:id',userController.loadProducts);


//single product
user_route.get('/singleproduct/:id',userController.userSingleProductLoad);


//all produsts get
user_route.get('/allproducts',userController.viewAllProducts);

// add cart

user_route.get('/cart',cartController.viewCart);

//add to cart

user_route.get('/addcart/:id',cartController.addCart)

//delete cart
user_route.get('/deletecart/:id',cartController.deleteCart)

//view wishlist
user_route.get('/wishlist',wishlistController.loadWishlist)
user_route.get('/addtoWishlist/:id',wishlistController.addToWishlist)


//removewishlist
user_route.get('/removeWishlist/:id',wishlistController.removeWishlist)


user_route.post('/checkoutSingle',orderController.checkoutSingle)
//show checkout

user_route.get('/checkout',orderController.viewCheckout)

user_route.post('/checkout',orderController.successLoad)
user_route.post('/verify-payment',orderController.PaymentVerified)



//view orders 
user_route.get('/orders',orderController.viewOrders)

//logout
user_route.get('/logout',auth.islogout,userController.userLogout);


//change password
// user_route.get('/changePassword',userController.loadChangePassword);
user_route.post('/changePassword',userController.changePassword);

user_route.post('/returnOrder',orderController.returnOrder)


//user profile
user_route.get('/user',userController.userProfile);


//user address view
user_route.get('/address',userController.addressView);


//user add address
// user_route.get('/addAddress',userController.addAddress);
user_route.post('/addAddress',userController.insertAddress);
// user_route.get('/addAddressCheckout',userController.addAddressCheckout);
// user_route.post('/addAddressCheckout',userController.insertAddressheckout);
//edit profile details      
// user_route.get('/editProfile',userController.editProfile);
user_route.post('/editedProfile',userController.editedProfile);


//remove address
user_route.get('/removeAddress/:id',userController.removeAddress)

//get success page
user_route.get('/success',orderController.orderConfirmation)


//cancel order
user_route.post('/cancelOrder',orderController.cancelOrder)


//edit address
user_route.get('/editAddress/:id',userController.editAddress)
user_route.post('/editAddress/:id',userController.editedAddress)


//change product quantity
user_route.post ('/change-Product-Quantity',cartController.changeQuantity)

// view Orders
user_route.get ('/viewOrders/:id',orderController.DetailOrderView)

user_route.post('/applycoupon',couponController.applyCoupon)


user_route.post('/checkoutAddAddress',orderController.addAddressToCheckout)

user_route.post('/getProduct',productController.getProduct)
user_route.get('/getProduct',userController.viewAllProducts)

user_route.use(function(req, res) {
  res.render('error')
});

module.exports=user_route;