const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    country: { type: String, required: true },
    city: { required: true, type: String },
    address: { type: String, required: true },
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
    unique: true,
  },
  paymentInformation: {
    type: String,
  },
  invoices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  verificationCodes:[{
    code:Number,
    createdAt:{
      requried:true,
      type:Date,
      default:Date.now()
    }
  }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
