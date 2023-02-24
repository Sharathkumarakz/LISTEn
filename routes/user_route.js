const express=require("express");
const user_route=express();
const path=require("path");

const moment=require('moment');

const auth=require('../middlewares/userauth');

user_route.set('view engine','ejs');
user_route.set('views','./views/user')


user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}))

const userController=require("../controllers/user_controller")
const cartController=require("../controllers/cart_controller");
const wishlistController=require("../controllers/wishlist_controller");
const orderController=require("../controllers/order_controller");

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


//show checkout

user_route.get('/checkout',orderController.viewCheckout)

user_route.post('/checkout',orderController.successLoad)

//logout
user_route.get('/logout',auth.islogout,userController.userLogout);






//user profile
user_route.get('/user',userController.userProfile);


//user address view
user_route.get('/address',userController.addressView);


//user add address
user_route.get('/addAddress',userController.addAddress);
user_route.post('/addAddress',userController.insertAddress);

//edit profile details
user_route.get('/editProfile',userController.editProfile);
user_route.post('/editedProfile/:id',userController.editedProfile);


//remove address
user_route.get('/removeAddress/:id',userController.removeAddress)

//edit address
user_route.get('/editAddress/:id',userController.editAddress)
user_route.post('/editAddress/:id',userController.editedAddress)


//change product quantity
user_route.post ('/change-Product-Quantity',cartController.changeQuantity)


user_route.use(function(req, res) {
  res.render('error').end('error');
});

module.exports=user_route;