const Admin = require('../model/admin_data');
const Order=require("../model/order_data");
const User = require('../model/user_data');
const Category = require('../model/category_data');
const Product = require('../model/products_data');
const { ObjectId } = require('mongodb');
const moment = require('moment');

//admin login page
const loadsignin = async (req, res, next) => {
  try {
    res.render('admin_login');

  } catch (error) {
    next(error);

  }
}



//admin verify
const adminverify = async (req, res, next) => {
  try {
    const password = req.body.password;
    const username = req.body.username;

    const adminData = await Admin.findOne({ username: username });
    // console.log(adminData)
    if (adminData) {
      if (adminData.password === password) {
        req.session.admin_id = adminData._id

        res.redirect('/admin/dashboard')
      } else {
        res.render('admin_login', { message: "password is wrong" });
      }

    } else if (req.body.username === "" && req.body.password == "") {
      res.render('admin_login', { message: "username and password required" });
    } else {
      res.render('admin_login', { message: "username and password wrong" });

    }


  } catch (error) {
    next(error);
  }
}


//get dashboard

const dashboard = async (req, res, next) => {
  try {
    const categoryData=await Category.find({})
   const productData=await Product.find({}).populate('category').exec()
   console.log(productData);
    res.render('admin_dashboard',{categoryData:categoryData,productData:productData})
  } catch (error) {
    next(error);
  }
}







//view user
const viewUser = async (req, res, next) => {
  try {
    const user = await User.find({})

    res.render('user_management', { user: user, moment: moment })
  } catch (error) {
    next(error);
  }
}


//view order
const viewOrder=async(req,res,next)=>{
  try {
   
    const orderDetails=await Order.find({}).populate('product.productId').populate('userId')
    
    // const order=[];
    // if(orderDetails.length>0){
    //   for(let i=0;i<orderDetails.length;i++){
    //     order.push(await Order.findOne({}).populate('product.productId'))
    //   }
    // }
    // console.log("ooooooooooooooooooooooooooooooooooo"+order);

  
      
    // const user=[];
    // if(orderDetails.length > 0) {
    //   for(let i=0;i<orderDetails.length;i++){
    //      user.push(await Order.findOne({}).populate('userId'))
    //   }
    // }
    // console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuu"+user);
    // user:user,order:order,
    res.render('orders',{orderDetails:orderDetails})

  } catch (error) {
    next(error)
  }
}








//block user
const blockUser = async (req, res, next) => {
  try {

    const id = req.params.id;
    console.log("id" + req.params.id);
    await User.updateOne({ _id: id }, { $set: { status: false } })

    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
}



const dropdown= async (req,res,next)=>{
  console.log(req.body)
  try {
     console.log(req.body);
     const orderId=req.body.orderId
     const Status=req.body.status
     const change = await Order.updateOne({orderId:orderId }, {
      $set: { status: Status}
     })
     if(change){
      res.json({ success: true,Status})
     }
  } catch (error) {
    next(error);
  }

}


//unblock user
const unBlockUser = async (req, res, next) => {
  try {

    const id = req.params.id;
    console.log("id" + req.query.id);
    await User.updateOne({ _id: id }, { $set: { status: true } })

    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
}


//logout
const logOut = async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect('/admin')
  } catch (error) {
    next(error);
  }

}
module.exports = {
  loadsignin,
  adminverify,
  dashboard,
  viewUser,
  unBlockUser,
  blockUser,
  logOut,
  viewOrder,
  dropdown
}

