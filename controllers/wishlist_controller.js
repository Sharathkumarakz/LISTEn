const Product = require('../model/products_data');
const User= require('../model/user_data');
const Category= require('../model/category_data');

const loadWishlist=async (req,res)=>{
  try {
    if(req.session.user){
      const userdetails=req.session.user;

      const wishlistData=await User.findOne({_id:req.session.user._id}).populate('wishlist.product').exec()
    
      const categorydata = await Category.find({})
      res.render('wishlist',{
        categorydata: categorydata,
      userdetails:userdetails,
      wishlistData:wishlistData
    })
    }else{
      res.redirect('/login')
    }
   
  } catch (error) {
    console.log(error.message);
  }
}


const addToWishlist=async (req,res)=>{
  try {
    if(req.session.user){
      const userdetails=req.session.user;
      const categorydata = await Category.find({})

      id=req.params.id;
      
      username=req.session.user.username;
         
       
      const wishlistInserted=await User.updateOne({username:username},{$push:{wishlist:{product:id}}})
      const wishlistData=await User.findOne({_id:req.session.user._id}).populate('wishlist.product').exec()
      res.render('wishlist',{
        categorydata: categorydata,
      userdetails:userdetails,
      wishlistData:wishlistData
    })
    }else{
      res.redirect('/login')
    }
   
  } catch (error) {
    console.log(error.message);
  }
}



const removeWishlist=async (req,res)=>{
  try {
    if(req.session.user){
      const userdetails=req.session.user;
      const categorydata = await Category.find({})

      id=req.params.id;
      
      username=req.session.user.username;
         
           
      const deleteWishlist=await User.updateOne({username:username},{$pull:{wishlist:{product:id}}})
 
       const wishlistData=await User.findOne({_id:req.session.user._id}).populate('wishlist.product').exec()
      res.render('wishlist',{
        categorydata: categorydata,
      userdetails:userdetails,
      wishlistData:wishlistData
    })
    }else{
      res.redirect('/login')
    }
   
  } catch (error) {
    console.log(error.message);
  }
}
module.exports = {
  loadWishlist,
  addToWishlist,
  removeWishlist
}