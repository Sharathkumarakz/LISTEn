const Category = require('../model/category_data');
const Product = require('../model/products_data');
const User = require('../model/user_data');
const Order = require('../model/order_data');
const order_data = require('../model/order_data');
const Coupon=require('../model/coupon_data');
const { v4: uuidv4 } = require('uuid');
const crypto=require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();


var instance = new Razorpay({
  key_id:process.env.KEY_ID,
  key_secret:process.env.KEY_SECRET,
});



const moment = require('moment');
const { truncateSync } = require('fs');
const { truncate } = require('fs/promises');
const { findOne } = require('../model/category_data');



const viewCheckout = async (req, res, next) => {
  try {
    if (req.session.user) {
      
        const categorydata = await Category.find({});
        const userData = await User.findOne({ username: req.session.user.username }).populate('cart.product').exec()
        if(userData.cart.length==0){

        res.redirect('/cart')

        }else{

        const total = userData.cartTotalPrice

        if (total <= 0) {

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
  
        } else {

          const userdetails = await User.findOne({ username: req.session.user.username })
          res.render('checkout', { categorydata: categorydata, userdetails: userdetails, userData: userData })
  
        }}
  
    } else {

      res.redirect('/login')

    }
  } catch (error) {

    next(error);

  }
}




//single checkout view



const checkoutSingle=async (req,res,next)=>{
  try{
    if(req.session.user){
  
      const categorydata = await Category.find({});
      const productData = await Product.find({_id:req.body.id})
      const userdetails = await User.findOne({ username: req.session.user.username })
      res.render('checkout', { categorydata: categorydata, userdetails: userdetails, productData:productData })
     
  }else{

    res.redirect('/login')

  }}catch{

    next(error)

  }
}



//success page
const successLoad = async (req, res, next) => {
  try {

    if (req.session.user) {
  
      let method = req.body.test
       if(req.body.address=="Select Address"){

       res.json({address:true})

       }else{

      if (method == "COD") {
      
        const username = await User.findOne({ username: req.session.user.username })
        const id = username._id
        const orders = req.body
        const orderDetails = [];
        orders.product = orderDetails;
        if (!Array.isArray(orders.proId)) {
          orders.proId = [orders.proId]
        }
        if (!Array.isArray(orders.singlePrice)) {
          orders.singlePrice = [orders.singlePrice]
        }

        if (!Array.isArray(orders.proQ)) {
          orders.proQ = [orders.proQ]
        }

        if (!Array.isArray(orders.qntyPrice)) {
          orders.qntyPrice = [orders.qntyPrice]
        }

        for (let i = 0; i < orders.proId.length; i++) {

          const productId = orders.proId[i]
          const quantity = orders.proQ[i]
          const singleTotal = orders.qntyPrice[i]
          const singlePrice =orders.singlePrice[i]
          orderDetails.push({ productId: productId, quantity: quantity, singleTotal: singleTotal,singlePrice:singlePrice })
        }
        const ordersave = new Order({
          userId: id,
          product: orders.product,
          total:req.body.total1,
          orderId:`order_id_${uuidv4()}`, 
          deliveryAddress: orders.address,
          paymentType: orders.test,
          date:Date.now(),
          discount:req.body.discount1,
          coupon:req.body.code
        })
        const saveData = await ordersave.save()
            await Coupon.updateOne({code:req.body.code},{$push:{userUsed:username._id}})  
            res.json({status:true})

   } else if (method == "UPI") {

        const username = await User.findOne({ username: req.session.user.username })
        const id = username._id
        const orders = req.body
        const orderDetails = [];
        const productId = req.body.proId
        orders.product = orderDetails;
        if (!Array.isArray(orders.proId)) {
          orders.proId = [orders.proId]
        }

        if (!Array.isArray(orders.proQ)) {
          orders.proQ = [orders.proQ]
        }
        if (!Array.isArray(orders.singlePrice)) {
          orders.singlePrice = [orders.singlePrice]
        }

        if (!Array.isArray(orders.qntyPrice)) {
          orders.qntyPrice = [orders.qntyPrice]
        }

        for (let i = 0; i < orders.proId.length; i++) {

          const productId = orders.proId[i]
          const quantity = orders.proQ[i]
          const singleTotal = orders.qntyPrice[i]
          const singlePrice =orders.singlePrice[i]
          orderDetails.push({ productId: productId, quantity: quantity, singleTotal: singleTotal,singlePrice:singlePrice})
          
       
        }
        const ordersave = new Order({
          userId: id,
          product: orders.product,
          total:req.body.total1,
          orderId:`order_id_${uuidv4()}`, 
          deliveryAddress: orders.address,
          paymentType: orders.test,
          date:Date.now(),
          discount:req.body.discount1,
          status:"Payment Failed",
          coupon:req.body.code
        })
        const saveData = await ordersave.save()
            await Coupon.updateOne({code:req.body.code},{$push:{userUsed:username._id}})  
       
        const latestOrder = await Order
        .findOne({})
        .sort({ date: -1 })
        .lean();
  
        let options={
          amount:req.body.total1*100,
          currency:"INR",
          receipt:""+latestOrder._id
        };
         instance.orders.create(options,function(err,order){
          res.json({viewRazorpay:true,order})  

        })

      } else if(method == "wallet"){
      
      let userdata=await User.findOne({_id:req.body.userId})
  
       if(req.body.total<=userdata.wallet){

        const username = await User.findOne({ username: req.session.user.username })
        const id = username._id
        const orders = req.body
        const orderDetails = [];
        orders.product = orderDetails;
        if (!Array.isArray(orders.proId)) {
          orders.proId = [orders.proId]
        }
        if (!Array.isArray(orders.singlePrice)) {
          orders.singlePrice = [orders.singlePrice]
        }

        if (!Array.isArray(orders.proQ)) {
          orders.proQ = [orders.proQ]
        }

        if (!Array.isArray(orders.qntyPrice)) {
          orders.qntyPrice = [orders.qntyPrice]
        }

        for (let i = 0; i < orders.proId.length; i++) {

          const productId = orders.proId[i]
          const quantity = orders.proQ[i]
          const singleTotal = orders.qntyPrice[i]
          const singlePrice =orders.singlePrice[i]
          orderDetails.push({ productId: productId, quantity: quantity, singleTotal: singleTotal,singlePrice:singlePrice })

        }
        const ordersave = new Order({
          userId: id,
          product: orders.product,
          total:req.body.total1,
          orderId:`order_id_${uuidv4()}`, 
          deliveryAddress: orders.address,
          paymentType: orders.test,
          date:Date.now(),
          discount:req.body.discount1,
          coupon:req.body.code
        })
        const saveData = await ordersave.save()
            await Coupon.updateOne({code:req.body.code},{$push:{userUsed:username._id}})  
     const walletMinus=await User.updateOne({username: req.session.user.username},{$inc:{wallet:-req.body.total1}})
       res.json({status:true})

   }else{

    res.json({insufficiant:true})

   }
    
      } else{

      res.json({radio:true})
      }

 }   } else {

      res.redirect('/login')

    }
  } catch (error) {

    next(error);

  }
}

//verify payment 
const PaymentVerified= async(req,res,next)=>{
     try {

      if(req.session.user){

        const latestOrder = await Order
        .findOne({})
        .sort({ date: -1 })
        .lean();
  
        await Order.updateOne({orderId: latestOrder.orderId},{$set:{status:"confirmed"}})
    
          const details=req.body
          let hmac=crypto.createHmac('sha256',process.env.KEY_SECRET)
          hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
          hmac=hmac.digest('hex')
          if(hmac==details['payment[razorpay_signature]']){
          
              res.json({status:true})

          }else{
       
          res.json({failed:true})

          }

          }else{

          res.redirect('/login')

          }
      
          } catch (error) {

          next(error);

          } 
     }


//view orders

const viewOrders = async (req, res, next) => {
  try {
    if (req.session.user) {

      const categorydata = await Category.find({});
      const username = req.session.user.username
      const userdetails = await User.findOne({ username: username });
      const orderDetails = await Order.find({})
      const order = await Order.find({ userId: userdetails._id }).populate('product.productId').sort({date:-1})
      res.render('order',
        {
          categorydata: categorydata,
          userdetails: userdetails,
          orderDetails: orderDetails,
          order: order
        })
    } else {

      res.redirect('/login')

    }

   } catch (error) {

    next(error);

   }

}

//view order details

const DetailOrderView = async (req, res, next) => {
  try {
    if (req.session.user) {
      const id = req.params.id
      const order = await Order.findOne({ _id: id }).populate('product.productId').populate('userId')
      const categorydata = await Category.find({});
      const userdetails = await User.findOne({ username: req.session.user.username })
      res.render('view_order', { categorydata: categorydata, userdetails: userdetails, order: order, moment: moment })

    } else {

      res.redirect('/login')

    }

  } catch (error) {

    next(error);

  }

}

//cancel order

const cancelOrder = async (req, res, next) => {
  try {
    if (req.session.user) {
      const orderId = req.body.orderId
      const status = req.body.value
      const change = await Order.updateOne({ _id: orderId }, {
        $set: {
          status: status
        }
      })

      const order=await Order.findOne({_id:orderId}).populate('userId').populate('product.productId')
        
      for(let i=0;i<order.product.length;i++){   

        await Product.updateOne({_id:order.product[i].productId},{$inc:{stock:order.product[i].quantity}})
              
       }
      if(order.paymentType=="wallet" || order.paymentType=="UPI"){

        await User.updateOne({_id:order.userId},{$inc:{wallet:order.total}})

      }
     
      if (change) {

        res.json({ success: true, status })

      }

    } else {

      res.redirect('/login')

    }
  } catch (error) {

    next(error);

  }
}




const addAddressToCheckout=async(req,res,next)=>{
    try {
     
        const username = req.session.user.username
        const addressinserted = await User.updateOne({ username: username }, {
          $push: {
            address: {
              houseName: req.body.hname,
              street: req.body.street,
              district: req.body.district,
              country: req.body.country,
              state: req.body.state,
              pincode: req.body.pincode,
              phone: req.body.number
            }
          }
        })
      res.json({success:true})  

    } catch (error) {

      next(error);

    }
}


//success get 

const orderConfirmation =async(req,res,next)=>{
  try{
    if(req.session.user){
      const categorydata = await Category.find({});
      const userdetails = await User.findOne({ username: req.session.user.username })
      const removing = await User.updateOne({ username: req.session.user.username }, {
        $set: {
          cart:[]
        }
      }) 
      const latestOrder = await Order
      .findOne({})
      .sort({ date: -1 })
      .lean();
     
      const order = await Order.findOne({ _id:latestOrder._id}).populate('product.productId')
       for(let i=0;i<latestOrder.product.length;i++){   

        await Product.updateOne({_id:latestOrder.product[i].productId},{$inc:{stock:-latestOrder.product[i].quantity}})
      
       }
       
        res.render('success', { categorydata: categorydata, userdetails: userdetails, order: order, moment: moment })
       
    }

  }catch{

    next(error);

  }
}

//view order-admin
const loadViewOrder=async (req,res,next)=>{
  try {

    const orderId=req.params.id
    const orderDetails=await Order.findOne({orderId:orderId}).populate('product.productId').populate('userId')
    res.render('view_order',{orderDetails:orderDetails,moment:moment})
    
  } catch (error) {

    next(error);

  }
}


const returnOrder= async (req,res,next)=>{
  try {
    if(req.session.user){
  
      if(req.body.one==undefined){

        res.json({error:true})

      }else{

      const updateOrder=await Order.updateOne({_id:req.body.order},{$set:{
        returnReason:req.body.one,status:"Return pending"
      }})

     const data=await Order.findOne({_id:req.body.order})
      res.redirect('/orders')

    }}else{

      res.redirect('/login')

    }
  } catch (error) {

    next(error);
    
  }
}



module.exports = {
  viewCheckout,
  successLoad,
  viewOrders,
  DetailOrderView,
  cancelOrder,
  addAddressToCheckout,
  orderConfirmation,
  PaymentVerified,
  loadViewOrder,
  checkoutSingle,
  returnOrder
}