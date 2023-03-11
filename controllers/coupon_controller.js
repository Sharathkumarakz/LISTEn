const Category = require('../model/category_data');
const Product = require('../model/products_data');
const User = require('../model/user_data');
const Order = require('../model/order_data');
const moment=require('moment');
const Coupon =require('../model/coupon_data');

//view coupon
const loadCoupons=async (req,res,next)=>{
    try {
        const coupons=await Coupon.find({})
        res.render('coupons',{coupons:coupons,moment:moment})
    } catch (error) {
        next(error);
    }
}

//load add coupon
const loadAddCoupon=async (req,res,next)=>{
    try {
        res.render('add_coupon')
    } catch (error) {
        next(error);
    }
}


//insert coupon to database
const insertCoupon=async (req,res,next)=>{
    try {
       
       const coupon=new Coupon({
        code:req.body.code,
        discount:req.body.discount, 
        expirationDate:req.body.expirationDate,
        maxDiscount:req.body.maxDiscount,
        MinPurchaceAmount:req.body.MinPurchaceAmount,
        percentageOff:req.body.percentageOff
       })
       const saving=await coupon.save()
       res.redirect('/admin/coupons')

    } catch (error) {

        next(error);

    }
}


//apply coupon
const applyCoupon=async (req,res,next)=>{
    try {

      const couponDetails=await Coupon.findOne({code:req.body.code})
      if(couponDetails){
      const user=await User.findOne({username: req.session.user.username})
      
      const found=await Coupon.findOne({code:req.body.code,userUsed: { $in: [user._id] } })
      const code=couponDetails.code
      const datenow=Date.now()
    if(found){
        res.json({used:true})
    }else{
      if(datenow<=couponDetails.expirationDate){
           if(couponDetails.MinPurchaceAmount<=req.body.total){
            let discountAmount=req.body.total*couponDetails.percentageOff/100
            if(discountAmount<=couponDetails.maxDiscount){

               let  discountValue= discountAmount
               let  value=req.body.total-discountValue
               res.json({amountokay:true,value,discountValue,code})
            
            }else{

                let  discountValue=couponDetails.maxDiscount
                let  value=req.body.total-discountValue
                res.json({amountokay:true,value,discountValue,code})

            }
      
           }else{
    
            res.json({amountnokay:true})

           }

        
      }else{
   
         res.json({datefailed:true})

      }}}else{

        res.json({invalid:true})

      }
    } catch (error) {

       next(error)
       
    }
  }
  
//delete coupon
const deleteCoupon=async (req,res,next)=>{
    try {

      const id=req.params.id
      await Coupon.deleteOne({_id:id})
      res.redirect('/coupons')

    } catch (error) {

        next(error)

    }
}


//edit coupon
const EditCoupon=async(req,res,next)=>{
    try {

        const id=req.params.id
        const couponDta=await Coupon.findOne({_id:id})
        res.render('edit_coupon',{coupondata:couponDta})

    } catch (error) {

        next(error)

    }
}

//save coupon
const SaveCoupon=async(req,res,next)=>{
    try {

        const id=req.params.id
        await Coupon.updateOne({_id:id},{$set:{
        code:req.body.code,
        expirationDate:req.body.expirationDate,
        maxDiscount:req.body.maxDiscount,
        MinPurchaceAmount:req.body.minPurchaceAmount,
        percentageOff:req.body.percentageOff
    }})
       res.redirect('/admin/coupons')

    } catch (error) {

        next(error)
        
    }
}




module.exports ={
    loadCoupons,
    loadAddCoupon,
    insertCoupon,
    applyCoupon,
    deleteCoupon,
    EditCoupon,
    SaveCoupon
}