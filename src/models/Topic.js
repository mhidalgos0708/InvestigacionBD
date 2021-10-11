const mongoose = require('mongoose');
const { Schema } = mongoose;

const TopicSchema = new Schema ({
    title: {type: String, required: true},
    code: { type: String, required: false }
    //course: { type: 'ObjectId', ref: 'Course', required: false }
});

module.exports = mongoose.model('Topic', TopicSchema);