const Product = require('../model/products_data');
const User = require('../model/user_data');
const Category = require('../model/category_data');
const { ObjectId } = require('mongodb');
const { create } = require('../model/admin_data');
const { json } = require('body-parser');
const { countDocuments } = require('../model/category_data');

//view cart
const viewCart = async (req, res, next) => {
  try {
    if (req.session.user) {

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
        cartData: cartData
      })
    } else {

      res.redirect('/login')

    }

  } catch (error) {

    next(error);

  }
}

//add cart

const addCart = async (req, res, next) => {
  try {

    const id = req.params.id
    const prodetails = await Product.findOne({ _id: id })
    if (req.session.user) {
      const id = req.params.id
       if(prodetails.stock==0){
   res.json({stock:true})
       }else{
      const found = await User.findOne({ username: req.session.user.username, "cart.product": id })

      if (found) {
        const username = req.session.user.username;
        const deleteWishlist = await User.updateOne({ username: username }, { $pull: { wishlist: { product: id } } })
        res.json({ exist: true })
      } else {
        
        const username = req.session.user.username;
        const cartinserted = await User.updateOne({ username: username }, { $push: { cart: { product: id, quantity: 1, productTotalPrice: prodetails.price } } })

      
        const cart = await User.findOne({ username: username }).populate('cart.product').exec()
        const userdetails = await User.findOne({ username: username });
        const cartData = await User.findOne({ _id: userdetails._id }).populate('cart.product').exec()
        const deleteWishlist = await User.updateOne({ username: username }, { $pull: { wishlist: { product: id } } })
        res.json({ done: true })
         }
      } 
    }
    else {

      res.redirect('/login')

    }

  } catch (error) {
    next(error);
  }
}


const deleteCart = async (req, res, next) => {
  try {

    if (req.session.user) {

      id = req.params.id
      const username = req.session.user.username;
      const deleted = await User.updateOne({ username: username }, { $pull: { cart: { product: id } } })
      res.json({ done: true })

    } else {

      res.json({ logout: true })

    }
  } catch (error) {

    next(error);

  }
}

//change quantity


const changeQuantity = async (req, res, next) => {
  try {
 
    if (req.session.user) {

      const price1 = req.body.ptotal
      const prodId = req.body.product
      const productdetails = await Product.findOne({ _id: prodId })

      const count = req.body.count
      const user = await User.findOne({ username: req.session.user.username })
      const inc = await User.updateOne({ username: req.session.user.username, "cart.product": prodId }, {
        $inc: { 'cart.$.quantity': count }
      })
      const cartqty = await User.findOne({_id: user._id, "cart.product": prodId},{"cart.quantity.$":1,_id:0})    
      const qqq = cartqty.cart[0].quantity;
      const qty = (await Product.findOne({_id: prodId},{_id:0,stock:1})).stock
     
      if(qqq > qty) {
        var stockStatus = "OutOf Stock"       
      }else{
        var stockStatus =  "In Stock"
      }

      const qnty = await User.findOne({ username: req.session.user.username, "cart.product": prodId }, { "cart.$": 1 })
      const productprice = productdetails.price * qnty.cart[0].quantity
      const inctotal = await User.updateOne({ _id: user._id, "cart.product": prodId }, {
        $set: { 'cart.$.productTotalPrice': productprice }

      })
      const username = req.session.user.username
      const cart = await User.findOne({ username: username }).populate('cart.product').exec()
      let cartTotal = 0;
      for (let i = 0; i < cart.cart.length; i++) {

        cartTotal += cart.cart[i].productTotalPrice;
      }
      const add = await User.updateOne({ username: username }, {
        $set: { cartTotalPrice: cartTotal }
      })

      res.json({ success: true, productprice, cartTotal,stockStatus})


    } else {
      res.json({ logout: true })
    }
  } catch (error) {
    next(error);
  }
};



module.exports = {
  viewCart,
  addCart,
  deleteCart,
  changeQuantity,
 
}