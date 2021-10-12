const mongoose = require('mongoose');
const { Schema } = mongoose;

const FilterSchema = new Schema ({
    section: {type: String, required: true},
    category: {type: Array, required: true},
    brand: {type: Array, required: true},
    price: {type: Array, required: true},
    size: {type: Array, required: true},
    tags: {type: Array, required: true}
});

module.exports = mongoose.model('Filter', FilterSchema);