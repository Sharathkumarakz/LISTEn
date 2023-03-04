const Product = require('../model/products_data');
const User = require('../model/user_data');
const Category = require('../model/category_data');

const loadWishlist = async (req, res) => {
  try {
    if (req.session.user) {
      const id = req.session.user.username;
      const userdetails = await User.findOne({ username: id });
      const wishlistData = await User.findOne({ _id: userdetails._id }).populate('wishlist.product').exec()

      const categorydata = await Category.find({})
      res.render('wishlist', {
        categorydata: categorydata,
        userdetails: userdetails,
        wishlistData: wishlistData
      })
    } else {
      res.redirect('/login')
    }

  } catch (error) {
    console.log(error.message);
  }
}


const addToWishlist = async (req, res, next) => {
  try {
    if (req.session.user) {
      id = req.params.id;
      const found = await User.findOne({ username: req.session.user.username, "wishlist.product": id })
      if (found) {
        // res.redirect('/wishlist')
        // res.redirect('/')
        res.json({exist:true})
      } else {
        const usename = req.session.user.username;
        const categorydata = await Category.find({})
        const userdetails = await User.findOne({ username: usename })


        const username = req.session.user.username;


        const wishlistInserted = await User.updateOne({ username: username }, { $push: { wishlist: { product: id } } })
        const wishlistData = await User.findOne({ _id: userdetails._id }).populate('wishlist.product').exec()
        // res.render('wishlist', {
        //   categorydata: categorydata,
        //   userdetails: userdetails,
        //   wishlistData: wishlistData
        // })
        // res.redirect('/')
        res.json({done:true})
      }
    } else {
      // res.redirect('/login')
      res.json({logout:true})
    }

  } catch (error) {
    next(error);
  }
}



const removeWishlist = async (req, res, next) => {
  try {
    if (req.session.user) {
      const name = req.session.user.username;
      const categorydata = await Category.find({})
      const userdetails = await User.findOne({ username: name })
      const id = req.params.id;

      username = req.session.user.username;


      const deleteWishlist = await User.updateOne({ username: username }, { $pull: { wishlist: { product: id } } })

      const wishlistData = await User.findOne({ _id: userdetails._id }).populate('wishlist.product').exec()
      res.render('wishlist', {
        categorydata: categorydata,
        userdetails: userdetails,
        wishlistData: wishlistData
      })
    } else {
      res.redirect('/login')
    }

  } catch (error) {
    next(error);
  }
}
module.exports = {
  loadWishlist,
  addToWishlist,
  removeWishlist
}