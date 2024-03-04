const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
     productId:{ type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true},
      quantity: { type: Number, required: true },
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

module.exports = Invoice;
