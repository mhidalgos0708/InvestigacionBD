const mongoose = require('mongoose');
const { Schema } = mongoose;

const SelectedFilterSchema = new Schema ({
    section: {type: String, required: true},
    category: {type: String, required: false},
    brand: {type: String, required: false},
    price: {type: String, required: false},
    size: {type: String, required: false},
    tags: {type: String, required: false}
});

module.exports = mongoose.model('SelectedFilter', SelectedFilterSchema);