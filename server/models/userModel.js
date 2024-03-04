const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  publishedProducts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Product" }],
  purchasedProducts: [{productId:{ type: mongoose.SchemaTypes.ObjectId, ref: "Product"} , quantities: [
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
  ],}],
  role: {
    type: String,
    required: true,
    default: "customer",
    emun: ["customer", "admin", "manager"],
  },
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
  verificationCodes: [
    {
      code: Number,
      createdAt: {
        requried: true,
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
