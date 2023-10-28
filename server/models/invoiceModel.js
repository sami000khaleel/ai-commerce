const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  totalPrice: { type: Number, required: true },
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

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
