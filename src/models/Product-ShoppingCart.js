const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductShoppingCartSchema = new Schema ({
    code: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    total: {type: Number, required: true}
});

module.exports = mongoose.model('ProductShoppingCart', ProductShoppingCartSchema);
