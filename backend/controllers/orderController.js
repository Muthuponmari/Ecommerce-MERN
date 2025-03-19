const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');
//create order api/vi/order
exports.createOrder = async (req, res, next) => {
    const cartItems = req.body;
    console.info(cartItems);
    const amount = Number(cartItems.reduce((acc, item) => { return acc + item.product.price * item.qty}, 0)).toFixed(2);
    const status = 'pending';
    const order = await OrderModel.create({cartItems, amount, status})

    //updating order stock
    cartItems.forEach(async (item) => {
        const product = await ProductModel.findById(item.product._id);
        product.stock = product.stock - item.qty;
        await product.save();
    })
    res.json({
        success: true,
        order
    })
}