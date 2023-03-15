const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://sharathkannanakz:sharadha@cluster0.lotufey.mongodb.net/listen',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log('connection sucsessful')
}).catch((error) => {
  console.log('somthing wrong', error)
})  