const Ads = require('../model/banners_data');
const Category = require('../model/category_data');

const loadAds = async (req, res, next) => {
  try {

    const add = await Ads.find({})
    res.render('add_ads', { add: add })

  } catch (error) {
    next(error);
  }
}

const addAdds = async (req, res, next) => {
  try {

    const categoryData = await Category.find({})
    res.render('add_view', { categoryData: categoryData })

  } catch (error) {

    next(error);

  }
}


const insertAdds = async (req, res, next) => {
  try {

    const images = [];
    for (file of req.files) {
      images.push(file.filename);
    }
    const add = new Ads({
      name: req.body.head,
      description: req.body.description,
      image: images,
      url: req.body.url

    });
    const added = await add.save();
    if (added) {


      res.redirect('/admin/ads');
    } else {

      res.render('add_view', { message: "action failed" });

    }

  } catch (error) {

    next(error);

  }
}




const loadEditBanner = async (req, res, next) => {
  try {

    id = req.params.id
    const details = await Ads.find({ _id: id })
    res.render('edit_add', { details: details })

  } catch (error) {

    next(error);

  }
}


const saveEditBanner = async (req, res, next) => {
  try {

    const id = req.params.id;
    const images = [];
    for (file of req.files) {
      images.push(file.filename);
    }
    if(req.files==0){
      const id = req.params.id;
    console.log("varnnn");
    await Ads.updateOne({ _id: id }, {
      $set: {
        name: req.body.name,
        description: req.body.description,
        url: req.body.url 
      }
      
    })
    res.redirect('/admin/ads');
  }
   
  else{
    await Ads.updateOne({ _id: id }, {
      $set: {
        name: req.body.head,
        description: req.body.description,
        image: images,
        url: req.body.url

      }
    })
    res.redirect('/admin/ads');
  }} catch (error) {

    next(error);

  }
}



const deleteAdd = async (req, res, next) => {
  try {

    const id = req.params.id;
    await Ads.deleteOne({ _id: id })
    res.redirect('/admin/ads');

  } catch (error) {

    next(error);

  }
}
module.exports = {
  loadAds,
  addAdds,
  insertAdds,
  loadEditBanner,
  saveEditBanner,
  deleteAdd
}