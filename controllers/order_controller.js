const Category = require('../model/category_data');
const Product = require('../model/products_data');
const User = require('../model/user_data');

const viewCheckout=async(req,res,next)=>{
  try {
    if(req.session.user){
      
  const  categorydata=await Category.find({});

  const userData=await User.findOne({username:req.session.user.username}).populate('cart.product').exec()
  
  const userdetails=await User.findOne({username: req.session.user.username})
      res.render('checkout',{ categorydata: categorydata, userdetails: userdetails,userData:userData })
   
    }else{
      res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
}

//checkout page get



module.exports ={
  viewCheckout
}