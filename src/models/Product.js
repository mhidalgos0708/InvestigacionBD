const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema ({
    code:{type: String, required: true},
    name: {type: String, required: true},
    category: {type: String, required: true},
    brand: {type: String, required: true},
    tags: {type: Array, required: true},
    price: {type: Number, required: true},
    size: {type: String, required: true},
    color: {type: String, required: true},
    photo: {type: String, required: true},
    stock: {type: Number, required: true}
});

module.exports = mongoose.model('Product', ProductSchema);