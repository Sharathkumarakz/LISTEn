const mongoose=require("mongoose");

const AdsData= new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  image:{
    type:Array,
    required:true
  },
  url:{
    type:String,
    required:true
  },
  status:{
    type:Number,
    default:true,
    required:true
  },
});

module.exports=mongoose.model('Ads',AdsData);



