


const islogin=async(req,res,next)=>{

try {
  if(req.session.admin_id){

  }
else{
  res.redirect('/admin');
}
next()
} catch (error) {
  console.log(error)
}

}



const islogout=async(req,res,next)=>{

  try {
    if(req.session.admin_id){
      return res.redirect('/admin/dashboard')
    }  
    
    next()
    
  } catch (error) {
   console.log(error)
  }
  
  }


  module.exports={
    islogin,
    islogout
  }