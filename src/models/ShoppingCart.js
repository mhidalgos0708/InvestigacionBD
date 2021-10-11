const mongoose = require('mongoose');
const { stringify } = require('querystring');
const { Schema } = mongoose;

const ShoppingCartSchema = new Schema ({
    clientid: {type: Number, required: true},
    clientname: {type: String, required: true},
    products: {type: Array, required: true},
    total: {type: Number, required: true}
})

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
/*
[{
    productimage: {type: String, required: true},
    productid: {type: String, required: true},
    productname: {type: String, required: true},
    productprice: {type: Number, required: true},
    quantity: {type: Number, required: true}
}],
*/