const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dsicount:{
    type:Number,
    required:true
    ,
    max:1,
    min:0
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imagesUrls: [{
    type: String,
    required: true
  }],
  quantity: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
