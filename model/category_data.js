const mongoose=require("mongoose");

const categoryData = new mongoose.Schema({
      categoryName:{
        type:String,
        required:true
      },
      description:{
        type:String,
        required:true
      },
      date:{
        type:Date,
        required:true,
        default:Date.now()
      },
   
});
module.exports=mongoose.model('Category',categoryData);