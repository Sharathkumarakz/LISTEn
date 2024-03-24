const mongoose = require('mongoose')
require('dotenv').config();
const connectHere=process.env.MONGO
mongoose.connect(connectHere,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log('connection sucsessful')
}).catch((error) => {
  console.log('somthing wrong', error)
})  