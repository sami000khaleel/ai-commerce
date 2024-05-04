const { throwError } = require("../errorHandler");
const Bill = require("../models/billModel");
const Product = require("../models/productModel");
const nodemailer = require('nodemailer');
class billMiddlware {
  static async createBill(cart, userId) {
    let bill = {};
    let totalPrice = 0;
    bill.user = userId;
    bill.products = []; // Initialize products array
    for (let element of cart) {
        const product = await Product.findById(element.productId);
        if (!product) {
            throw new Error('Product not found');
        }
        bill.products.push({
            productId: product._id,
            quantity: { size: element.size, quantity: element.quantity },
            price: product.price * element.quantity,
        });
        totalPrice += product.price * element.quantity;
    }
    bill.totalPrice = totalPrice;
    bill=await Bill.create(bill)
    return bill
  }
  static async sendBillEmail(bill,user){

    const billTable=await billMiddlware.createBillTable(bill)
    // Nodemailer configuration
    const transporter=nodemailer.createTransport({
      service:'gmail',
      auth:{
      user:process.env.UESR_NAME,
      pass:process.env.APP_PASSWORD
    }
  })
// Email options
const mailOptions = {
from: 'ai-commerce',
to: user.email,
subject: 'Bill Details',
html: billTable
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
if (error) {
  console.error('Error sending email:', error);
} else {
  console.log('Email sent:', info.response);
}
});
  }
  static async createBillTable(bill) {
    let table = `
        <table border="1">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Size</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const product of bill.products) {
        const a = await Product.findById(product.productId);
        table += `
            <tr>
                <td>${a.name}</td>
                <td>${product.price}</td>
                <td>${product.quantity.quantity}</td>
                <td>${product.quantity.size}</td>
            </tr>
        `;
    }

    table += `
            </tbody>
        </table>
    `;

    return table;
}

  static calculateTotalPrice(bill, products) {
    let totalPrice = 0;
    for (let product of products) {
      const foundProduct = bill.products.find((p) =>
        p.productId.equals(product._id)
      );
      if (foundProduct) {
        for (let quantity of foundProduct.quantities) {
          totalPrice += product.price * quantity.quantity;
        }
      }
    }
    return totalPrice;
  }
}
module.exports = billMiddlware;
