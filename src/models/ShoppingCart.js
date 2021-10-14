const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShoppingCartSchema = new Schema ({
    clientid: {type: String, required: true},
    clientname: {type: String, required: true},
    products: {type:Array, required:true},
    total: {type: Number, required: true}
})

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
