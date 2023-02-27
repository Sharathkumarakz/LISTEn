const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// const Product = require('../model/products_data');

// const Schema = mongoose.Schema;

const orderData = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
    default: `order_id_${uuidv4()}`, // generate a custom order ID using uuid
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  product: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity:{
          type:Number,
          required:true,
      } ,
      singleTotal:{
        type:Number,
        required:true
    }
  }
  ],
  total: {
    type: Number,
  },
  paymentType: {
    type: String,
    required:true,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

module.exports = mongoose.model('Order', orderData);
 