const express=require("express");
const admin_route=express();
const path=require("path");

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin')

const auth=require('../middlewares/auth');






admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}))

const multer=require("multer");
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,path.join(__dirname,'../public/product_images'));
  },
  filename:function(req,file,cb){
    const name=Date.now()+'-'+file.originalname;
 cb(null,name);
  }
});

const upload=multer({storage:storage})

const adminController=require("../controllers/admin_controller")
const productController=require("../controllers/product_controller")
const categoryController=require("../controllers/category_controller")
const adsController=require("../controllers/Ads_controller")


admin_route.get('/',auth.islogout,adminController.loadsignin);

admin_route.post('/',adminController.adminverify);

admin_route.get('/dashboard',auth.islogin,adminController.dashboard);


// //view product
admin_route.get('/products',auth.islogin,productController.viewProduct);

//list user
admin_route.get('/users',auth.islogin,adminController.viewUser);

//view category
admin_route.get('/category',auth.islogin,categoryController.viewCategory);


//add category
admin_route.get('/addCategory',auth.islogin,categoryController.addCategory);

admin_route.post('/addCategory',categoryController.insertCategory);

//add product
admin_route.get('/addProducts',auth.islogin,productController.addProduct);

admin_route.post('/addProducts',upload.array('image',4),productController.insertProduct);

//delete category
 admin_route.get('/deleteCategory/:id',auth.islogin,categoryController.deleteCategory);


 //delete product
 admin_route.get('/deleteProduct/:id',auth.islogin,productController.deleteProduct);
 

 //block user
 admin_route.get('/blockUser/:id',auth.islogin,adminController.blockUser);
//unblock user
admin_route.get('/unblockUser/:id',auth.islogin,adminController.unBlockUser);

//unlist products
admin_route.get('/unlistProduct/:id',auth.islogin,productController.unlistProduct);

//list product
admin_route.get('/listProduct/:id',auth.islogin,productController.listProduct);




// banner
admin_route.get('/addAdds',auth.islogin,adsController.addAdds);
admin_route.post('/addAdds',upload.array('image',1),adsController.insertAdds);

// edit banner
admin_route.get('/editAdd/:id',auth.islogin,adsController.loadEditBanner);
admin_route.post('/editAdd/:id',upload.array('image',1),adsController.saveEditBanner);

//delete banner
admin_route.get('/deleteadd/:id',auth.islogin,adsController.deleteAdd);
 

//edit category
admin_route.get('/editCategory/:id',auth.islogin,categoryController.EditCategory);
admin_route.post('/editCategory/:id',categoryController.editedCategory);

//logout
admin_route.get('/logout',auth.islogin,adminController.logOut);

//edit user
admin_route.get('/editProduct/:id',auth.islogin,productController.loadEditProduct);
admin_route.post('/editProduct/:id',upload.array('image',4),productController.editProduct);

//edit Ads
admin_route.get('/ads',auth.islogin,adsController.loadAds);


module.exports=admin_route;