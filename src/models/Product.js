const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema ({
    name: {type: String, required: true},
    category: {type: String, required: true},
    brand: {type: String, required: true},
    tags: {type: Array, required: true},
    price: {type: String, required: true},
    size: {type: Number, required: true},
    color: {type: String, required: true},
    photo: {type: String, required: true}
});

module.exports = mongoose.model('Product', ProductSchema);