const Product = require('../model/products_data');
const User= require('../model/user_data');
const Category= require('../model/category_data');
const { ObjectId } = require('mongodb');
const { create } = require('../model/admin_data');
const { json } = require('body-parser');

//view cart
const viewCart=async (req,res)=>{
  try {
    if(req.session.user){
    
      const userdetails=req.session.user;

       
      const categorydata = await Category.find({})
      const cartData=await User.findOne({_id:req.session.user._id}).populate('cart.product').exec()
        console.log("cccccccccccccccccdddddddd"+cartData);
   
      res.render('cart',{
        categorydata: categorydata,
        userdetails:userdetails,
       cartData:cartData
            
      })
    }else{
      res.redirect('/login')
    }
   
  } catch (error) {
    console.log(error.message);
  }
}

//add cart

const addCart=async (req,res)=>{
  try {

    if(req.session.user){
     
        
       id=req.params.id


        username=req.session.user.username;
         
       
        const cartinserted=await User.updateOne({username:username},{$push:{cart:{product:id,quantity:1}}})
        // console.log("keeeeeeeeeeeeeri"+cartinserted);
        const userdetails=req.session.user;
        const categorydata = await Category.find({})
        const cartData=await User.findOne({_id:req.session.user._id}).populate('cart.product').exec()
        res.render('cart',{categorydata: categorydata,userdetails:userdetails,cartData:cartData})
         console.log("cccccccccccccc"+cartData);

       }
    
    else{
      res.redirect('/login')
    }
   
  } catch (error) {
    console.log(error.message);
  }
}


const deleteCart=async(req,res)=>{
  try {
if(req.session.user){
  id=req.params.id
  username=req.session.user.username;
         
 
  const deleted=await User.updateOne({username:username},{$pull:{cart:{product:id,quantity:1}}})
 
  const userdetails=req.session.user;
  const categorydata = await Category.find({})
  const cartData=await User.findOne({_id:req.session.user._id}).populate('cart.product').exec()
  res.render('cart',{categorydata: categorydata,userdetails:userdetails,cartData:cartData})

}else{
  res.redirect('/login')
}
  } catch (error) {
    console.log(error.message);
  }
}



module.exports={
  viewCart,
  addCart,
  deleteCart
}