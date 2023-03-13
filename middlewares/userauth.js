const islogin = async (req, res, next) => {

  try {
    if (req.session.user) {

    }
    else {
      res.redirect('/');
    }
    next()
  } catch (error) {
    console.log(error)
  }

}




const islogout = async (req, res, next) => {

  try {
    if (req.session.user) {
     res.redirect('/')
    }

    next()

  } catch (error) {
    console.log(error)
  }

}


module.exports = {
  islogin,
  islogout
}