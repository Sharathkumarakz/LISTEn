const Admin = require('../model/admin_data');

const User = require('../model/user_data');
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
    res.render('admin_dashboard')
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
  logOut
}

