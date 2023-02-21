const Product = require('../model/products_data');
const Category = require('../model/category_data');
const User = require('../model/user_data');
const ads = require('../model/banners_data');

let session;
// var phonenumber

require('dotenv').config();
const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authtoken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountsid, authtoken);
const bcrypt = require("bcrypt")

const userLoad = async (req, res) => {
  try {

    if (req.session.user) {
      const userdetails = req.session.user;
      const categoryData = await Category.find({})
      const banners = await ads.find({})
      const productData = await Product.find({ status: 1 }).populate('category').exec()

      res.render('home', {
        userdetails: userdetails,
        banners: banners,
        categoryData: categoryData,
        productData: productData,
      });
    } else {
  
      const categoryData = await Category.find({})
  
      const banners = await ads.find({})

      const tws = await Product.find({ category: "63ef09c21eff86b6deb89ed7", status: 1 })
      const productData = await Product.find({ status: 1 }).populate('category').exec()
      res.render('home', {
    
        banners: banners,
        categoryData: categoryData,
        productData: productData,
      });

    }

  } catch (error) {
    console.log(error.message);
  }
}


const userSingleProductLoad = async (req, res) => {

  try {
    if (req.session.user) {
      const id = req.params.id;
      const userdetails = req.session.user;
      console.log("ssssssssssssssssss" + userdetails)
      const cartcheck = await User.findOne({ _id: userdetails._id, 'cart.product': id }, { 'product.$': 1 })
      const categoryData = await Category.find({})
      if (cartcheck) {
        var cart = 'found'
      }
      // console.log("id" + req.query.id);
      const singleproduct = await Product.find({ _id: id })

      res.render('singleproduct', { singleproduct: singleproduct, categoryData: categoryData, userdetails: userdetails, cartcheck: cart });
    } else {
      const categoryData = await Category.find({})
      const id = req.params.id;
      // console.log("id" + req.query.id);
      const singleproduct = await Product.find({ _id: id })
      res.render('singleproduct', { singleproduct: singleproduct, categoryData: categoryData });
    }
  } catch (error) {
    console.log(error.message);
  }

}

//load login

const loadLogin = async (req, res) => {
  try {
    res.render('login')
  } catch (error) {
    console.log(error.message);
  }

}
//login check

const loginCheck = async (req, res) => {
  try {
    const user = req.body.username;
    const password = req.body.password;
    const datas = await User.findOne({ username: user });

    if (datas) {
      const compared = await bcrypt.compare(password, datas.password)
      if (compared == true) {
        if (datas.status == 1) {
          session = req.session
          session.user = datas
          {
            res.redirect('/')
          }

        } else {
          res.render('login', { message: 'You are Blocked' })
        }

      } else {

        res.render('login', { message: 'password is wrong' })
      }
    } else if (password == '' && user == '') {
      res.render('login', { message: 'username and password is required' })
    } else {
      res.render('login', { message: 'username and password is wrong' })
    }

  } catch (error) {
    console.log(error.message);
  }

}


const loadSignup = async (req, res) => {
  try {
    res.render('signup')
  } catch (error) {
    console.log(error.message);
  }

}

//verify signup

const verifySignup = async (req, res) => {

  req.session.user = req.body
  if (req.body.firstname == '' || req.body.lastname == '' || req.body.email == '' || req.body.password == '' || req.body.password == '') {
    res.render('signup', { message: "All fields are required" });
  } else {
    // console.log('body'+req.body)
    phonenumber = req.body.mobilenumber;
    try {

      const otpResponse = await client.verify.v2
        .services('VA3814afa129f17fe65c4ad63df60b09d3')
        .verifications.create({
          to: `+91${phonenumber}`,
          channel: 'sms',
        });
      res.render('otppage')
    } catch (error) {
      console.log(error.message);
    }
  }
}


//verifying otp
const verifyOtp = async (req, res, next) => {
  const otp = req.body.otp;
  try {
    req.session.user
    const details = req.session.user;

    const verifiedResponse = await client.verify.v2
      .services('VA3814afa129f17fe65c4ad63df60b09d3')
      .verificationChecks.create({
        to: `+91${details.mobilenumber}`,
        code: otp,
      })
    console.log('details' + details)
    if (verifiedResponse.status === 'approved') {
      details.password = await bcrypt.hash(details.password, 10)
      const userdata = new User({
        firstname: details.firstname,
        lastname: details.lastname,
        email: details.email,
        username: details.username,
        password: details.password,
        phone: details.mobilenumber

      })
      const userData = await userdata.save();
      // console.log()
      // console.log("sss" + userData)
      if (userData) {
        res.redirect('/');
      } else {
        res.render('otppage', { message: "wrong otp" })
      }

    } else {
      res.render('otppage', { message: "wrong otp" })
    }
  } catch (error) {
    console.log(error.message);
  }
}




//load prductspage
const loadProducts = async (req, res) => {
  try {
    if (req.session.user) {
      const name = req.params.id;
      const categoryData = await Category.find({ _id: name })
      const userdetails = req.session.user;
      const products = await Product.find({ category: name, status: 1 });
      const categorydata = await Category.find({})
      res.render('productslist', { products: products, categorydata: categorydata, categoryData: categoryData, userdetails: userdetails })
    } else {
      const name = req.params.id;
      const categoryData = await Category.find({ _id: name })
      const products = await Product.find({ category: name, status: 1 });
      const categorydata = await Category.find({})
      res.render('productslist', { products: products, categorydata: categorydata, categoryData: categoryData })
    }
  } catch (error) {
    console.log(error.message);
  }

}

//show all products
const viewAllProducts = async (req, res) => {
  try {
    if (req.session.user) {
      const userdetails = req.session.user
      const products = await Product.find({ status: 1 })


      const categorydata = await Category.find({})
      res.render('allproducts', { categorydata: categorydata, products: products, userdetails: userdetails })
    } else {
      const products = await Product.find({ status: 1 })


      const categorydata = await Category.find({})
      res.render('allproducts', { categorydata: categorydata, products: products, })
    }
  } catch (error) {
    console.log(error.message);
  }
}

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/')
  } catch (error) {
    console.log(error.message);
  }

}


//error
const error = async (req, res) => {
  try {

    res.render('/*')
  } catch (error) {
    console.log(error.message);
  }

}

module.exports = {
  userLoad,
  userSingleProductLoad,
  loadLogin,
  loadSignup,
  verifySignup,
  loadProducts,
  verifyOtp,
  loginCheck,
  viewAllProducts,
  userLogout,
  error
}