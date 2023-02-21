const express=require("express");
const user_route=express();
const path=require("path");

const moment=require('moment');

const auth=require('../middlewares/userauth');

user_route.set('view engine','ejs');
user_route.set('views','./views/user')



const bodyparser=require('body-parser')
user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({extended:true}))

const userController=require("../controllers/user_controller")
const cartController=require("../controllers/cart_controller");
const wishlistController=require("../controllers/wishlist_controller");


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

//logout
user_route.get('/logout',auth.islogout,userController.userLogout);



user_route.use(function(req, res) {
  res.render('error').end('error');
});

module.exports=user_route;