const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  publisherId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  reviews: [
    {
      userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
      comment: {
        required: true,
        type: String,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  name: {
    type: String,
    required: true,
  },
  previousPrice:Number,
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "T-Shirt",
      "Shoes",
      "Shorts",
      "Shirt",
      "Pants",
      "Other",
      "Top",
      "Outwear",
      "Dress",
      "Body",
      "Longsleeve",
      "Undershirt",
      "Hat",
      "Polo",
      "Blouse",
      "Hoodie",
      "Skip",
      "Blazer",
      "Skirt"
    ],
  },
  imagesNames: [
    {
      type: String,
      required: true,
    },
  ],
  quantities: [
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
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
