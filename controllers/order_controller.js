const Category = require('../model/category_data');
const Product = require('../model/products_data');
const User = require('../model/user_data');
const Order = require('../model/order_data');
const order_data = require('../model/order_data');





// const Razorpay=require('razorpay')
// var instance = new Razorpay({
//   key_id: 'rzp_test_oyzsQbMBs7ToCQ',
//   key_secret: 'cdI0zZA72BYHTVS8mQpY27eX',
// });




const moment = require('moment');



const viewCheckout = async (req, res, next) => {
  try {
    if (req.session.user) {

      const categorydata = await Category.find({});

      const userData = await User.findOne({ username: req.session.user.username }).populate('cart.product').exec()
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

      }



    } else {
      res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
}

//success page
const successLoad = async (req, res, next) => {
  try {

    if (req.session.user) {

      let method = req.body.test


      if (method == "COD") {

        console.log(req.body);
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

        if (!Array.isArray(orders.qntyPrice)) {
          orders.qntyPrice = [orders.qntyPrice]
        }

        for (let i = 0; i < orders.proId.length; i++) {

          const productId = orders.proId[i]
          const quantity = orders.proQ[i]
          const singleTotal = orders.qntyPrice[i]
          orderDetails.push({ productId: productId, quantity: quantity, singleTotal: singleTotal })

          const reduceStock=await Product.updateOne({_id:productId},{$inc:{quantity:100}})
   
        }
        const ordersave = new Order({
          userId: id,
          product: orders.product,
          total: orders.total,
          deliveryAddress: orders.address,
          paymentType: orders.test
        })
        const saveData = await ordersave.save()

        

        const removing = await User.updateOne({ username: req.session.user.username }, {
          $pull: {
            cart: { product: { $in: productId } }

          }
        })

        const orderdetail=await Order.findOne({userId:id})
        const orderId=orderdetail._id
        

       
        const order = await Order.findOne({ _id:orderId}).populate('product.productId')
        console.log("ayega");
        console.log(order);
        const categorydata = await Category.find({});
  
        const userdetails = await User.findOne({ username: req.session.user.username })
        res.render('success', { categorydata: categorydata, userdetails: userdetails, order: order, moment: moment })
  
       

      } else if (method == "UPI") {

  //       console.log("booooooooooooooooody");
  //       console.log(req.body);

  //     var options={
  //       amount:req.body.total,
  //       currency:'INR',
  //       receipt:"rcp_1",

  //     };
  //     instance.orders.create(options, function(err,orders){
  //       console.log(orders);
  //     })
  //     function verify(orders){
  //     var options = {
  //       "key": "rzp_test_oyzsQbMBs7ToCQ", // Enter the Key ID generated from the Dashboard
  //       "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //       "currency": "INR",
  //       "name": "Acme Corp", //your business name
  //       "description": "Test Transaction",
  //       "image": "https://example.com/your_logo",
  //       "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //       "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
  //       "prefill": {
  //           "name": "Gaurav Kumar", //your customer's name
  //           "email": "gaurav.kumar@example.com",
  //           "contact": "9000090000"
  //       },
  //       "notes": {
  //           "address": "Razorpay Corporate Office"
  //       },
  //       "theme": {
  //           "color": "#3399cc"
  //       }
  //   };
  // }         

        
        // const categorydata = await Category.find({});

        // const userdetails = await User.findOne({ username: req.session.user.username })
        // res.render('success', { categorydata: categorydata, userdetails: userdetails})

      } else {

        const categorydata = await Category.find({});

        const userData = await User.findOne({ username: req.session.user.username }).populate('cart.product').exec()
        const userdetails = await User.findOne({ username: req.session.user.username })
        res.render('checkout', { categorydata: categorydata, userdetails: userdetails, userData: userData, message: 'Select Payment Method' })
      }

    } else {
      res.redirect('/login')
    }
  } catch (error) {
    next(error);
    console.log(error);
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

      const order = await Order.find({ userId: userdetails._id }).populate('product.productId')

      console.log("llllllllllllllllllllllll" + order);
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
      const order = await Order.findOne({ _id: id }).populate('product.productId')
      console.log("ayega");
      console.log(order);
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


module.exports = {
  viewCheckout,
  successLoad,
  viewOrders,
  DetailOrderView,
  cancelOrder

}