
const Category = require('../model/category_data');

const { ObjectId } = require('mongodb');

const moment=require('moment');

//view category
const viewCategory = async (req, res) => {
  try {
    const categorydata = await Category.find({})

    res.render('view_category', { categoryData: categorydata,moment:moment})
  } catch (error) {
    console.log(error.message);
  }
}


//load category
const addCategory = async (req, res) => {
  try {
    res.render('add_category')
  } catch (error) {
    console.log(error.message);
  }
}



//add category
const insertCategory = async (req, res) => {
  if(req.body.name==''||req.body.description==''){

    res.render('add_category', { message: "All fields are mantatory"});
  }else{
  console.log(req.body.name)
 const name= req.body.name
  const regex= new RegExp(name,"i");
  const data=await Category.find({categoryName:{$regex: regex}})
  datalen=data.length
  
  try {
    if(datalen==1){
      res.render('add_category', { message: "category already exists"});
    }else{
    const category = new Category({
      categoryName: req.body.name,
      description: req.body.description
    });
    const categoryData = await category.save();
    
    if (categoryData) {

 
      res.render('add_category', { message: "category  added successfully"});
    } else {
      
      res.render('add_category', { message: "action failed" });

    }}
  } catch (error) {
    console.log(error.message);
  }
}
}


//delete category
const deleteCategory=async(req,res)=>{
  try {
    
    const id=req.params.id;
    console.log("id"+req.query.id);
   await Category.deleteOne({_id:id})
    res.redirect('/admin/category');
  } catch (error) {
    console.log(error.message);
  }
}





//load edit product
const EditCategory=async(req,res)=>{
  try {
    const id= req.params.id
    console.log("iiiiiiiiidddddddd"+id)
    const details=await Category.find({_id:id})
    const main=details.id;
     
    const categoryData=await Category.find({})
    // console.log("iiiiiiiiidddddddd"+details)
    res.render('edit_category',{details:details,categoryData:categoryData,main:main})
    
  } catch (error) {
    console.log(error.message);
  }

}



//editproduct
const editedCategory=async(req,res)=>{
  try {
    const id= req.params.id;
    console.log(req.body);
    console.log(id);
  
    await Category.updateOne({_id:id},{$set:{
      categoryName: req.body.name,
      description: req.body.description
    }})
    res.redirect('/admin/category');
  } catch (error) {
    console.log(error.message);
  }

}


module.exports = {
  viewCategory,
  addCategory,
  insertCategory,
  deleteCategory,
  EditCategory,
  editedCategory
}
