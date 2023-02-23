const Product = require('../model/products_data');
const User= require('../model/user_data');
const Category= require('../model/category_data');
const { ObjectId } = require('mongodb');
const { create } = require('../model/admin_data');
const { json } = require('body-parser');
const { countDocuments } = require('../model/category_data');

//view cart
const viewCart=async (req,res)=>{
  try {
    if(req.session.user){
    
      const id=req.session.user.username;
      const userdetail=await User.findOne({username:id});
  // console.log("pooooooooooooooooooii"+userdetails);

      const categorydata = await Category.find({})
      
      const cartData=await User.findOne({_id:userdetail._id}).populate('cart.product').exec()
        // console.log("cccccccccccccccccdddddddd"+cartData);
        const username=req.session.user.username
        const cart=await User.findOne({username:username}).populate('cart.product').exec()
        let cartTotal=0;
       for(let i=0; i<cart.cart.length; i++) {
      
         cartTotal += cart.cart[i].productTotalPrice;
       }
       const add=await User.updateOne({username:username},{
         $set:{cartTotalPrice:cartTotal}
       })
       const userdetails=await User.findOne({username:username});
   
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
    const id=req.params.id
    const prodetails=await Product.findOne({_id:id})
    if(req.session.user){
      const id=req.params.id
  
     const found=await User.findOne({username:req.session.user.username,"cart.product":id})
        if(found){
          // const qnty=await User.updateOne({username:req.session.user.username,"cart.product":id},{
          //   $inc:{"cart.$.quantity":1}
          // })  
        res.redirect('/cart')
        }else {
         
   
      //  console.log("111111111111111111"+id);
         const username=req.session.user.username;
        const cartinserted=await User.updateOne({username:username},{$push:{cart:{product:id,quantity:1,productTotalPrice:prodetails.price}}})
        
        const categorydata = await Category.find({})
        const cart=await User.findOne({username:username}).populate('cart.product').exec()
         let cartTotal=0;
        for(let i=0; i<cart.cart.length; i++) {
  
          cartTotal += cart.cart[i].productTotalPrice;
        }
        const add=await User.updateOne({username:username},{
          $set:{cartTotalPrice:cartTotal}
        })
        const userdetails=await User.findOne({username:username});
        const cartData=await User.findOne({_id:userdetails._id}).populate('cart.product').exec()
      
        res.render('cart',{categorydata: categorydata,userdetails:userdetails,cartData:cartData})
        //  console.log("cccccccccccccc"+cartData);

       }
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
  const username=req.session.user.username;
         
 
  const deleted=await User.updateOne({username:username},{$pull:{cart:{product:id}}})
 
  // const userdetails=await User.findOne({username:username})
  // const categorydata = await Category.find({})
  // const cartData=await User.findOne({_id:userdetails._id}).populate('cart.product').exec()
  res.redirect('/cart')

}else{
  res.redirect('/login')
}
  } catch (error) {
    console.log(error.message);
  }
}

//change quantity

   
const changeQuantity = async (req, res) => {
  try {
    if (req.session.user) {

   const price1=req.body.ptotal 
   const  prodId=req.body.product
  const productdetails=await Product.findOne({_id:prodId})  
 
  const count= req.body.count
  const user=await User.findOne({username:req.session.user.username})
  const  inc=await User.updateOne({username:req.session.user.username,"cart.product":prodId},{
    $inc:{'cart.$.quantity':count}
    
  })
  const qnty=await User.findOne({username:req.session.user.username,"cart.product":prodId},{"cart.$":1})
  const productprice=productdetails.price*qnty.cart[0].quantity
 
  const  inctotal=await User.updateOne({_id:user._id,"cart.product":prodId},{
    $set:{'cart.$.productTotalPrice':productprice}
  
  })
 const username=req.session.user.username
  const cart=await User.findOne({username:username}).populate('cart.product').exec()
  let cartTotal=0;
 for(let i=0; i<cart.cart.length; i++) {

   cartTotal += cart.cart[i].productTotalPrice;
 }
 const add=await User.updateOne({username:username},{
   $set:{cartTotalPrice:cartTotal}
 })
  console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"+cartTotal);
    res.json({success:true,productprice,cartTotal})
 
    
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};
     


module.exports={
  viewCart,
  addCart,
  deleteCart,
  changeQuantity,
  
}