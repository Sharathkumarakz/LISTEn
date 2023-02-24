const Category = require('../model/category_data');
const Product = require('../model/products_data');
const User = require('../model/user_data');
const Order = require('../model/order_data');
const viewCheckout=async(req,res,next)=>{
  try {
    if(req.session.user){
      


  const  categorydata=await Category.find({});

  const userData=await User.findOne({username:req.session.user.username}).populate('cart.product').exec()
  const total=userData.cartTotalPrice
if(total<=0){
  const id = req.session.user.username;
  const userdetail = await User.findOne({ username: id });


  const categorydata = await Category.find({})

  const cartData = await User.findOne({ _id: userdetail._id }).populate('cart.product').exec()
 
  const username = req.session.user.username
  const cart = await User.findOne({ username: username }).populate('cart.product').exec()
  let cartTotal = 0;
  for (let i = 0; i < cart.cart.length; i++) {

    cartTotal += cart.cart[i].productTotalPrice;
  }
  const add = await User.updateOne({ username: username }, {
    $set: { cartTotalPrice: cartTotal }
  })
  const userdetails = await User.findOne({ username: username });

  res.render('cart', {
    categorydata: categorydata,
    userdetails: userdetails,
    cartData: cartData,
  message: 'Cart is Empty'

  })

}else{
  const userdetails=await User.findOne({username: req.session.user.username})
  res.render('checkout',{ categorydata: categorydata, userdetails: userdetails,userData:userData })

}


 
    }else{
      res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
}

//success page
const successLoad=async (req,res,next)=>{
  try {
    
      if(req.session.user){
        
    let method=req.body.test


      if(method=="cod"){
        
        console.log(req.body);
  const username=await User.findOne({username:req.session.user.username})
       const id=username._id
      console.log("iiiiiiiiiiiiiiii"+id);
       const orders=req.body
       const orderDetails=[];

       orders.product =orderDetails;
       if(!Array.isArray(orders.proId)){
        orders.proId=[orders.proId]
       }

       if(!Array.isArray(orders.proQ)){
        orders.proQ=[orders.proQ]
       }

       if(!Array.isArray(orders.qntyPrice)){
        orders.qntyPrice=[orders.qntyPrice]
       }

       for(let i=0; i<orders.proId.length;i++){

        const productId=orders.proId[i]
        const quantity=orders.proQ[i]
        const singleTotal=orders.qntyPrice[i]
        orderDetails.push({productId:productId, quantity:quantity,singleTotal:singleTotal})
       }
       const order=new Order({
        userId:id,
        product:orders.product,
        total:orders.total,
        deliveryAddress:orders.address,
        paymentType:orders.test
      })
      const saveData=await order.save()
         
       
        


        const  categorydata=await Category.find({});
      
        const userdetails=await User.findOne({username: req.session.user.username})
            res.render('success',{ categorydata: categorydata, userdetails: userdetails })
         
      }else if(method=="upi"){
        const  categorydata=await Category.find({});
      
        const userdetails=await User.findOne({username: req.session.user.username})
            res.render('success',{ categorydata: categorydata, userdetails: userdetails })
         
      }else{
        
  const  categorydata=await Category.find({});

  const userData=await User.findOne({username:req.session.user.username}).populate('cart.product').exec()
        const userdetails=await User.findOne({username: req.session.user.username})
        res.render('checkout',{ categorydata: categorydata, userdetails: userdetails,userData:userData,message:'Select Payment Method' })
      }
       
    }else{
      res.redirect('/login')
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
}



module.exports ={
  viewCheckout,
  successLoad
}