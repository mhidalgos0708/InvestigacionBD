const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema ({
    code:{type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    brand: {type: String, required: true},
    code: {type: String, required: true},
    category: {type: String, required: true},
    tagType: {type: String, required: true},
    tagClothing: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    photo: {type: String},
    size: {type: String},
    color: {type: String}
});

module.exports = mongoose.model('Product', ProductSchema );
/*const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema ({
    name: {type: String, required: true},
    category: {type: String, required: true},
    brand: {type: String, required: true},
    tagClothing: {type: String, required: true},
    tagType: {type: String, required: true},
    price: {type: Number, required: true},
    size: {type: String, required: true},
    color: {type: String, required: true},
    photo: {type: String, required: true},
    description: {type: String, required: true},
    stock: {type: Number, required: true}
});

module.exports = mongoose.model('Product', ProductSchema);*/