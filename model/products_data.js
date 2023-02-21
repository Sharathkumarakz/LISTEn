const { ObjectId } = require("mongodb");
const mongoose=require("mongoose");

const productData = new mongoose.Schema({
      name:{
        type:String,
        required:true
      },
      image:{
        type:Array,
        required:true
      },
      category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      stock:{
        type:Number,
        required:true,
       
      },
      price:{
        type:Number,
        required:true
      },
      description:{
        type:String,
        required:true
      },
      brand:{
        type:String,
        required:true
      },
      status:{
       type:Number,
       default:true
      }
});
module.exports=mongoose.model('Product',productData);