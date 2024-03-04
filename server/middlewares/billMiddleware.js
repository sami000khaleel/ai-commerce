const Bill=require('../models/billModel')
class billMiddlware{
    static calculateTotalPrice(bill, products) {
        let totalPrice = 0;
        for (let product of products) {
            const foundProduct = bill.products.find(p => p.productId.equals(product._id));
            if (foundProduct) {
                for (let quantity of foundProduct.quantities) {
                    totalPrice += product.price * quantity.quantity;
                }
            }
        }
        return totalPrice;
    }
    static async createBill(products, user) {
        try {
            const bill = new Bill({
                user: user._id,
                products: products.map(product => ({ productId: product._id, quantitities: product.purchasedQuantities })),
            });
            return await bill.save();
        } catch (error) {
            throwError('Error creating bill', 500);
        }
    }
    
}
module.exports=billMiddlware