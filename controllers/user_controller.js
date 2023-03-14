const Product = require('../model/products_data');
const Category = require('../model/category_data');
const User = require('../model/user_data');
const ads = require('../model/banners_data');

let session;

require('dotenv').config();
const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authtoken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_SID
const client = require("twilio")(accountsid, authtoken);
const bcrypt = require("bcrypt");
const { ObjectId } = require('mongodb');
const { request } = require('express');


const userLoad = async (req, res, next) => {
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
      const productData = await Product.find({ status: 1 }).populate('category').exec()
      res.render('home', {
        banners: banners,
        categoryData: categoryData,
        productData: productData,
      });
    }

  } catch (error) {

    next(error);

  }
}


const userSingleProductLoad = async (req, res, next) => {

  try {
    if (req.session.user) {

      const id = req.params.id;
      const userdetails = req.session.user;
      const cartcheck = await User.findOne({ _id: userdetails._id, 'cart.product': id }, { 'product.$': 1 })
      const categoryData = await Category.find({})
      if (cartcheck) {
        var cart = 'found'
      }
      const singleproduct = await Product.find({ _id: id })
      res.render('singleproduct', { singleproduct: singleproduct, categoryData: categoryData, userdetails: userdetails, cartcheck: cart });

    } else {

      const categoryData = await Category.find({})
      const id = req.params.id;
      const singleproduct = await Product.find({ _id: id })
      res.render('singleproduct', { singleproduct: singleproduct, categoryData: categoryData });
    }

  } catch (error) {

    res.render('error')


  }

}

//load login

const loadLogin = async (req, res, next) => {
  try {

    res.render('login')

  } catch (error) {

    next(error);

  }

}
//login check

const loginCheck = async (req, res, next) => {
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

    next(error);

  }

}


const loadSignup = async (req, res, next) => {
  try {

    res.render('signup')

  } catch (error) {

    next(error);

  }

}

//verify signup

const verifySignup = async (req, res, next) => {

  req.session.userdata = req.body
  const found = await User.findOne({ username: req.body.username })
  if (found) {

    res.render('signup', { message: "username already exist ,try another" });

  }
  else if (req.body.firstname == '' || req.body.lastname == '' || req.body.email == '' || req.body.password == '' || req.body.password == '') {
    res.render('signup', { message: "All fields are required" });

  } else {

    phonenumber = req.body.mobilenumber;

    try {

      const otpResponse = await client.verify.v2
        .services(serviceId)
        .verifications.create({
          to: `+91${phonenumber}`,
          channel: 'sms',
        });
      res.render('otppage')

    } catch (error) {

      next(error);

    }
  }
}


//verifying otp
const verifyOtp = async (req, res, next) => {
  const otp = req.body.otp;
  try {

    req.session.user
    const details = req.session.userdata;
    const verifiedResponse = await client.verify.v2
      .services('VA3814afa129f17fe65c4ad63df60b09d3')
      .verificationChecks.create({
        to: `+91${details.mobilenumber}`,
        code: otp,
      })
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
      req.session.user = userData
      if (userData) {

        res.redirect('/');

      } else {

        res.render('otppage', { message: "wrong otp" })

      }

    } else {

      res.render('otppage', { message: "wrong otp" })

    }
  } catch (error) {

    next(error);

  }
}




//load prductspage
const loadProducts = async (req, res, next) => {
  try {

    if (req.session.user) {

      const name = req.params.id;
      const categoryData = await Category.find({ _id: name })
      const userdetails = req.session.user;
      const products = await Product.find({ category: name, status: 1 });
      const categorydata = await Category.find({})
      res.render('productslist', {
        products: products,
        categorydata: categorydata,
        categoryData: categoryData,
        userdetails: userdetails
      })

    } else {

      const name = req.params.id;
      const categoryData = await Category.find({ _id: name })
      const products = await Product.find({ category: name, status: 1 });
      const categorydata = await Category.find({})
      res.render('productslist', {
        products: products,
        categorydata: categorydata,
        categoryData: categoryData
      })
    }

  } catch (error) {

    res.render('error')

  }

}

//show all products
const viewAllProducts = async (req, res, next) => {
  try {

    let page = 1
    page = req.query.page;
    let limit = 9;

    console.log();
    if (req.session.user) {

      const userdetails = req.session.user
      const products = await Product.find({ status: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()
      // .skip((page-1)*perPage)
      // .limit(perPage)
      const countproducts = await Product.find({ status: 1 })
        .countDocuments()
      let countdata = Math.ceil(countproducts / limit)
      const categorydata = await Category.find({})
      res.render('allproducts', { categorydata: categorydata, products: products, userdetails: userdetails, countproducts: countdata })

    } else {




      const products = await Product.find({ status: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()
      // .skip((page-1)*perPage)
      // .limit(perPage)
      const countproducts = await Product.find({ status: 1 })
        .countDocuments()
      let countdata = Math.ceil(countproducts / limit)

      const categorydata = await Category.find({})
      res.render('allproducts', { categorydata: categorydata, products: products, countproducts: countdata })

    }

  } catch (error) {

    next(error);

  }
}

const userLogout = async (req, res, next) => {
  try {

    req.session.destroy();
    res.redirect('/')

  } catch (error) {

    next(error);

  }

}


//user profile
const userProfile = async (req, res, next) => {
  try {
    if (req.session.user) {

      const name = req.session.user.username;
      const ids = await User.findOne({ username: name })
      const userdetails = await User.findOne({ _id: ids._id })
      const categorydata = await Category.find({})
      res.render('profile', { userdetails: userdetails, categorydata: categorydata })

    } else {

      res.redirect('/login')

    }
  } catch (error) {

    next(error);

  }
}

//address view
const addressView = async (req, res, next) => {
  try {
    if (req.session.user) {

      const name = req.session.user.username;
      const userdetails = await User.findOne({ username: name })
      const datas = await User.findOne({ _id: userdetails._id })
      const categorydata = await Category.find({})
      res.render('address', { userdetails: userdetails, categorydata: categorydata, datas: datas })

    } else {

      res.redirect('/login')

    }
  } catch (error) {

    next(error);

  }
}


//insert address
const insertAddress = async (req, res, next) => {
  try {

    if (req.session.user) {

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

      res.json({ status: true })

    } else {

      res.redirect('/login')

    }
  } catch (error) {

    next(error);

  }
}




//remove address
const removeAddress = async (req, res, next) => {
  try {

    if (req.session.user) {
      const id = req.params.id;
      const username = req.session.user.username;
      const removeinserted = await User.updateOne({ username: username }, {
        $pull: {
          address: {
            _id: id
          }
        }
      })
      res.redirect('/address')
    } else {
      res.redirect('/login')
    }

  } catch (error) {

    next(error);

  }

}


//edit address load

const editAddress = async (req, res, next) => {
  try {
    if (req.session.user) {

      const id = req.params.id
      const username = req.session.user.username
      const edit = await User.findOne({ username: username, "address._id": id }, { "address.$": 1 })
      const userdetails = req.session.user;
      const categorydata = await Category.find({})
      res.render('editAddress', { edit: edit, categorydata: categorydata, userdetails: userdetails })

    } else {

      res.redirect('/login')

    }

  } catch (error) {

    next(error);

  }
}

//edited address inserting
const editedAddress = async (req, res, next) => {
  try {

    if (req.session.user) {

      id = req.params.id;
      const setedited = await User.updateOne({ username: req.session.user.username, "address._id": id },
        {
          $set: {
            "address.$": req.body
          }
        })
      res.redirect('/address')

    } else {

      res.redirect('/login')

    }
  } catch (error) {

    next(error);

  }
}


//profile edit insert
const editedProfile = async (req, res, next) => {
  try {
    if (req.session.user) {

      if (req.body.fname == "" || req.body.lname == "" || req.body.email == "" || req.body.phone == "") {

        res.json({ NullField: true })

      } else {

        const update = await User.updateOne({ username: req.session.user.username }, {
          $set: {
            firstname: req.body.fname,
            lastname: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
          }
        })
        res.json({ done: true })

      }
    } else {

      res.redirect('/login')

    }
  } catch (error) {

    next(error);

  }
}


//change password load
const changePassword = async (req, res, next) => {
  try {
    if (req.session.user) {

      if (req.body.old == "" || req.body.new == "" || req.body.confirm == "") {
        res.json({ required: true })
      } else {
        const datas = await User.findOne({ username: req.session.user.username })
        const old = req.body.old
        const compared = await bcrypt.compare(old, datas.password)
        if (compared) {
          if (req.body.new == req.body.confirm) {

            const New = req.body.new
            const change = await bcrypt.hash(New, 10)
            const saving = await User.updateOne({ username: datas.username }, { $set: { password: change } })
            res.json({ done: true })

          } else {

            const name = req.session.user.username
            const userdetails = await User.findOne({ username: name })
            const categorydata = await Category.find({})
            res.json({ failedToMatch: true })

          }

        } else {

          const name = req.session.user.username
          const userdetails = await User.findOne({ username: name })
          const categorydata = await Category.find({})
          res.json({ incorrect: true })

        }
      }
    } else {

      res.redirect('/login');

    }

  } catch (error) {

    next(error);

  }
}




//error
const error = async (req, res, next) => {
  try {

    res.render('/*')

  } catch (error) {

    next(error);

  }

}





module.exports = {
  userLoad,
  userProfile,
  addressView,
  userSingleProductLoad,
  loadLogin,
  loadSignup,
  verifySignup,
  loadProducts,
  verifyOtp,
  loginCheck,
  viewAllProducts,
  userLogout,
  error,
  insertAddress,
  removeAddress,
  editAddress,
  editedAddress,
  editedProfile,
  changePassword,

}