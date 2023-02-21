const Ads = require('../model/banners_data');
const Category = require('../model/category_data');

const loadAds = async (req, res) => {
  try {
    const add=await Ads.find({})
    res.render('add_ads',{add:add})
  } catch (error) {
    console.log(error.message);
  }
}

const addAdds = async (req, res) => {
  try {
    const categoryData=await Category.find({})
    res.render('add_view',{categoryData:categoryData})
  } catch (error) {
    console.log(error.message);
  }
}


const insertAdds = async (req, res) => {
  try {
    const images=[];
    for(file of req.files){
      images.push(file.filename);
    }
       const add = new Ads({
      name: req.body.head,
      description: req.body.description,
      image:images,
      url: req.body.url
     
    });
    const added = await add.save();
    if (added) {


      res.redirect('/admin/ads');
    } else {

      res.render('add_view', { message: "action failed"});

    }
  } catch (error) {
    console.log(error.message);
  }
}




const loadEditBanner = async (req, res) => {
  try {
    id=req.params.id
  const details=await Ads.find({_id:id})
    res.render('edit_add',{details:details})
  } catch (error) {
    console.log(error.message);
  }
}


const saveEditBanner = async (req, res) => {
  try{
  const id= req.params.id;
    console.log(req.body);
    console.log(id);
    console.log(req.files);
    const images=[];
    for(file of req.files){
      images.push(file.filename);
    }
    await Ads.updateOne({_id:id},{$set:{
      name: req.body.head,
      description: req.body.description,
      image:images,
      url: req.body.url
   
    }})
    res.redirect('/admin/ads');
  } catch (error) {
    console.log(error.message);
  }
}



const deleteAdd = async (req, res) => {
  try {
    const id=req.params.id;
    console.log("id"+req.query.id);
   await Ads.deleteOne({_id:id})
    res.redirect('/admin/ads');

  } catch (error) {
    console.log(error.message);
  }
}
module.exports ={
  loadAds,
  addAdds,
  insertAdds,
  loadEditBanner,
  saveEditBanner,
  deleteAdd
}