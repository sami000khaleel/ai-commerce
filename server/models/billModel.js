const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  totalPrice:{
    type:String,
    required:true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      price:{
        required:true,
        type:String
      },
     productId:{ type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true},
      quantity: 
        {
          size: {
            type: String,
            required: true,
            enum: ["XS", "S", "L", "XL", "XXL", "XXXL"],
          },
          quantity: {
            type: Number,
            required: true,
            min: 0,
          },
        },
    
    },
  ],
  paymentStatus: {
    type: String,
    enum: ["paid", "pending"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
