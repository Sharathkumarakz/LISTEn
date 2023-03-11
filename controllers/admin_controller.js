const Admin = require('../model/admin_data');
const Order = require("../model/order_data");
const User = require('../model/user_data');
const Category = require('../model/category_data');
const Product = require('../model/products_data');
const Coupon = require('../model/coupon_data');
const { ObjectId } = require('mongodb');
const moment = require('moment');



//admin login page-------------------------------
const loadsignin = async (req, res, next) => {

  try {

    res.render('admin_login');

  } catch (error) {

    next(error);

  }

}


//admin verify-------------------------------------
const adminverify = async (req, res, next) => {

  try {

    const password = req.body.password;
    const username = req.body.username;
    const adminData = await Admin.findOne({ username: username });
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


//get dashboard-----------------
const dashboard = async (req, res, next) => {
  try {

    const categoryData = await Category.find({})
    const productData = await Product.find({}).populate('category').exec()
    const salesCount = await Order.find({ status: "delivered" }).count()
    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }, status: {
            $eq: "delivered"
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total" }
        }
      }
    ])

    const cancelledOrdersCount = await Order.aggregate([
      {
        $match: { status: "cancelled" }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ])

    const toatalCustomers = await User.find({}).count()
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const usersForTheLastWeek = await User.find({ date: { $gte: lastWeek } })
    const lessQuantityProducts = await Product.find({ stock: { $lt: 50 } })
    const ativeCoupons = await Coupon.find({ expirationDate: { $gt: new Date() } })
    const salesChart = await Order.aggregate([
      {
        $match: {
          status: {
            $eq: "delivered"
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          sales: { $sum: "$total" },
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $limit: 7
      }
    ])
    const date = salesChart.map((item) => {
      return item._id;
    })
    const sales = salesChart.map((item) => {
      return item.sales;
    })
    const confirmed = await Order.find({ status: "confirmed" }).count()
    const delivered = await Order.find({ status: "delivered" }).count()
    const shipped = await Order.find({ status: "shipped" }).count()
    const cancelled = await Order.find({ status: "cancelled" }).count()
    const UPI = await Order.find({ paymentType: "UPI", status: "delivered" }).count()
    const COD = await Order.find({ paymentType: "COD", status: "delivered" }).count()

    res.render('admin_dashboard', {
      categoryData: categoryData,
      productData: productData, salesCount, weeklyRevenue,
      cancelledOrdersCount, toatalCustomers,
      usersForTheLastWeek, lessQuantityProducts,
      ativeCoupons, confirmed, delivered, shipped, cancelled,
      UPI, COD, sales, date,
      moment: moment
    })

  } catch (error) {

    next(error);

  }
}



//view user--------------------
const viewUser = async (req, res, next) => {
  try {

    const user = await User.find({})

    res.render('user_management', { user: user, moment: moment })

  } catch (error) {

    next(error);

  }
}



//view order------------------
const viewOrder = async (req, res, next) => {
  try {

    const orderDetails = await Order.find({}).populate('product.productId').populate('userId')

    res.render('orders', { orderDetails: orderDetails })

  } catch (error) {

    next(error)

  }
}


//block user------------------
const blockUser = async (req, res, next) => {
  try {

    const id = req.params.id;
    await User.updateOne({ _id: id }, { $set: { status: false } })

    res.redirect('/admin/users');

  } catch (error) {

    next(error);

  }
}


const dropdown = async (req, res, next) => {
  try {

    const orderId = req.body.orderId
    const Status = req.body.status


    const change = await Order.updateOne({ orderId: orderId }, {
      $set: { status: Status }
    })

    if (Status == "Returned") {

      let orderdetails = await Order.findOne({ orderId: orderId }).populate('userId').populate('product.productId')

      let totalamount = orderdetails.total
      let userId = orderdetails.userId._id
     
      let addWallet = await User.updateOne({ _id: userId }, { $inc: { wallet: totalamount } })
      for (let i = 0; i < orderdetails.product.length; i++) {
        await Product.updateOne({ _id: orderdetails.product[i].productId }, { $inc: { stock: orderdetails.product[i].quantity } })

      }
      res.json({ success: true, Status })
    } else {



      const change = await Order.updateOne({ orderId: orderId }, {
        $set: { status: Status }
      })
      if (Status == "delivered") {

        const today = new Date();


        const dateAfter3Days = new Date(today);


        dateAfter3Days.setDate(today.getDate() + 7);

        const change = await Order.updateOne({ orderId: orderId }, {
          $set: { status: Status, deliveryDate: today, returnDate: dateAfter3Days }
        })


      }



      if (change) {

        res.json({ success: true, Status })

      }
    }
  } catch (error) {

    next(error);

  }

}


//unblock user------------------
const unBlockUser = async (req, res, next) => {
  try {

    const id = req.params.id;
   
    await User.updateOne({ _id: id }, { $set: { status: true } })

    res.redirect('/admin/users');

  } catch (error) {

    next(error);

  }
}


//sales report--------------------------

const salesReport = async (req, res, next) => {
  try {
    // create a new date object with the existing date
    const existingDate = new Date(req.body.to);

    // add one day to the existing date
    const newDate = new Date(existingDate);
    newDate.setDate(existingDate.getDate() + 1);





 
    if (req.body.from == "" || req.body.to == "") {
      res.render('sales', { message: 'all fields are equired' })
    } else {

      const ss = await Order.find({
        status: "delivered", date: {
          $gte: new Date(req.body.from),
          $lte: new Date(newDate)
        }
      }).populate("product.productId")
      res.render("sales_report", {ss});

    }
  } catch (error) {
    next(error);
  }
}


const salesReports = async (req, res, next) => {
  try {
    res.render('sales')

  } catch (error) {
    next(error);
  }
}


//logout----------------

const logOut = async (req, res, next) => {
  try {

    req.session.destroy();

    res.redirect('/admin')

  } catch (error) {

    next(error);

  }

}

//Exporting--------------

module.exports = {
  loadsignin,
  adminverify,
  dashboard,
  viewUser,
  unBlockUser,
  blockUser,
  logOut,
  viewOrder,
  dropdown,
  salesReport,
  salesReports
}












































