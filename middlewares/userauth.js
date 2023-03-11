const islogin = async (req, res, next) => {

  try {
    if (req.session.user) {

    }
    else {
      res.redirect('/');
    }
    next()
  } catch (error) {
   next(error);
  }

}




const islogout = async (req, res, next) => {

  try {
    if (req.session.user) {
      return res.redirect('/')
    }

    next()

  } catch (error) {
    next(error)
  }

}


module.exports = {
  islogin,
  islogout
}