const Product = require('../model/products_data');
const Category = require('../model/category_data');
const { ObjectId } = require('mongodb');

const fs = require('fs');
const path = require('path');

//show product list

const viewProduct = async (req, res, next) => {
  try {

    const products = await Product.find({})
    const datas = await Product.find({}).populate('category').exec()

    res.render('product_list', { products: products, datas: datas })
  } catch (error) {
    next(error);
  }
}


//add product page
const addProduct = async (req, res, next) => {
  try {
    const categoryData = await Category.find({})

    res.render('add_products', { categoryData: categoryData })
  } catch (error) {
    next(error);
  }
}





//insert product
const insertProduct = async (req, res, next) => {
  if (req.body.name == '' || req.body.category == '' || req.body.stock == '' || req.body.price == '' || req.body.description == '' || req.body.brand == '') {
    const categoryData = await Category.find({})
    res.render('add_products', { categoryData: categoryData, message: "All felds are needed" });
    console.log("hellow");

  } else {

    try {

      // console.log(req.files);
      const images = [];
      for (file of req.files) {
        images.push(file.filename);
      }
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: images,
        category: req.body.category,
        stock: req.body.stock,
        brand: req.body.brand
      });
      //  console.log(req.body)
      const productData = await product.save();

      if (productData) {


        res.redirect('/admin/products');
      } else {

        res.render('add_products', { message: "action failed" });

      }



    } catch (error) {
      next(error);
    }
  }
}



//delete product
const deleteProduct = async (req, res, next) => {
  try {

    const id = req.params.id;
    // console.log("id" + req.query.id);
    await Product.deleteOne({ _id: id })
    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }
}



//unlist products

const unlistProduct = async (req, res, next) => {
  try {

    const id = req.params.id;
    console.log("id" + req.params.id);
    await Product.updateOne({ _id: id }, {
      $set: { status: false }
    })
    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }
}


//list products

const listProduct = async (req, res, next) => {
  try {

    const id = req.params.id;
    console.log("id" + req.params.id);
    await Product.updateOne({ _id: id }, {
      $set: { status: true }
    })
    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }
}



//load edit product
const loadEditProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    const details1 = await Product.findOne({ _id: id }).populate('category').exec()

    const details = await Product.findOne({ _id: id })
    const main = details.id;

    const catData = await Category.find({ categoryName: details1.category.categoryName })
    const categoryData = await Category.find({})
    // console.log("iiiiiiiiidddddddd"+details)
    res.render('edit_products', { details: details, categoryData: categoryData, main: main, catData: catData })

  } catch (error) {
    next(error);
  }

}
//editproduct
const editProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(req.body);
    // console.log(id);
    // console.log(req.files);
    // const images = [];
    // for (file of req.files) {
    //   images.push(file.filename);
    // }
    await Product.updateOne({ _id: id }, {
      $set: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        // image: images,
        category: req.body.category,
        stock: req.body.stock,
        brand: req.body.brand

      }
    })
    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }

}

//edit  image
const loadEditImage = async (req, res, next) => {
  try {
    imagedata = req.files
    const proId = req.params.id
    const images = [];
    imagedata.forEach(element => {
      images.push(element.filename)
    })

    await Product.updateOne({ _id: proId }, { $push: { image: images } })
    res.redirect('/admin/editProduct/' + proId)
  } catch (error) {
    next(error);
  }
}


//delete product image
const deleteProductImage = async (req, res, next) => {
  try {

    const imagedata = req.params.imgId
    const proId = req.params.id
    fs.unlink(path.join(__dirname, '../public/product_images', imagedata), () => { })
    await Product.updateOne({ _id: proId }, { $pull: { image: imagedata } })
    res.redirect('/admin/editProduct/' + proId)
  } catch (error) {
    next(error);
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
  loadEditImage,
  deleteProductImage
}
