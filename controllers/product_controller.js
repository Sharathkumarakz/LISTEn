const Product = require('../model/products_data');
const Category = require('../model/category_data');
const { ObjectId } = require('mongodb');




//show product list

const viewProduct = async (req, res) => {
  try {

    const products = await Product.find({})
    const datas= await Product.find({}).populate('category').exec()
    console.log("ccccccccccccccccccccc"+datas.name);
    res.render('product_list',{products:products,datas:datas})
  } catch (error) {
    console.log(error.message);
  }
}


//add product page
const   addProduct = async (req, res) => {
  try {
    const categoryData = await Category.find({})
  
    res.render('add_products', { categoryData: categoryData })
  } catch (error) {
    console.log(error.message);
  }
}





//insert product
const insertProduct = async (req, res) => {
  if(req.body.name ==''||req.body.category ==''||req.body.stock ==''||req.body.price ==''||req.body.description ==''||req.body.brand==''){
    const categoryData = await Category.find({})
    res.render('add_products',{categoryData:categoryData,message: "All felds are needed"});
    console.log("hellow");

   }else{
   
  try {
 
    // console.log(req.files);
    const images=[];
    for(file of req.files){
      images.push(file.filename);
    }
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image:images,
      category: req.body.category,
      stock: req.body.stock,
      brand: req.body.brand
    });
    //  console.log(req.body)
    const productData = await product.save();
  
    if (productData) {


      res.redirect('/admin/products');
    } else {

      res.render('add_products', { message: "action failed"});

    }
  
   

  } catch (error) {
    console.log(error.message);
  }
}
}



//delete product
const deleteProduct=async(req,res)=>{
  try {
    
    const id=req.params.id;
    console.log("id"+req.query.id);
   await Product.deleteOne({_id:id})
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error.message);
  }
}



//unlist products

const unlistProduct=async(req,res)=>{
  try {
    
    const id=req.params.id;
    console.log("id"+req.params.id);
   await Product.updateOne({_id:id},{
    $set:{status:false}
   })
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error.message);
  }
}


//list products

const listProduct=async(req,res)=>{
  try {
    
    const id=req.params.id;
    console.log("id"+req.params.id);
   await Product.updateOne({_id:id},{
    $set:{status:true}
   })
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error.message);
  }
}



//load edit product
const loadEditProduct=async(req,res)=>{
  try {
    const id= req.params.id
    const details1=await Product.findOne({_id:id}).populate('category').exec()
  
    const details=await Product.find({_id:id})
    const main=details.id;
    console.log('this is detailssssssss in edit producttt' , details);
     console.log("ddddddddddddddddddd"+details1.category.categoryName);
     const catData=await Category.find({categoryName:details1.category.categoryName})
    const categoryData=await Category.find({})
    // console.log("iiiiiiiiidddddddd"+details)
    res.render('edit_products',{details:details,categoryData:categoryData,main:main,catData:catData})
    
  } catch (error) {
    console.log(error.message);
  }

}
//editproduct
const editProduct=async(req,res)=>{
  try {
    const id= req.params.id;
    console.log(req.body);
    console.log(id);
    console.log(req.files);
    const images=[];
    for(file of req.files){
      images.push(file.filename);
    }
    await Product.updateOne({_id:id},{$set:{
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image:images,
        category: req.body.category,
        stock: req.body.stock,
        brand: req.body.brand
   
    }})
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error.message);
  }

}


module.exports = {
  
  viewProduct,
  addProduct,
  insertProduct,
   unlistProduct,
  deleteProduct,
  listProduct,
  loadEditProduct,
 
  editProduct,
 
}
