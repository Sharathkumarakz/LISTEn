const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/listen");







// const bodyparser = require('body-parser')
const session=require("express-session")
const path=require('path')

// const fast2sms=require("fast-two-sms");


const express = require("express");
const app=express();
const nocache = require("nocache");


// app.use(bodyparser.urlencoded({ extended: false }))

// app.use(bodyparser.json())

app.use(express.urlencoded({extended:false}))

app.use(session({
  secret:"this is secret",
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:60000000}
}));
app.use(nocache());

//to access public folder
app.use(express.static(path.join(__dirname,"public")))
//for admin routes
const adminRoute=require('./routes/admin_route');
app.use('/admin',adminRoute); 

const userRoute=require('./routes/user_route');
app.use('/',userRoute); 


app.use((err,req,res,next)=>{
  console.log(err.stack);
  res.status(500).send(err.stack)
})


app.listen(3000,function(){
  console.log("server is running");
});


