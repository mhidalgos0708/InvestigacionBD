const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubTopicSchema = new Schema ({
    subTopictitle: {type: String, required: true},
    code: {type: String, required: true},
    title: {type: String, required: true}
});

module.exports = mongoose.model('SubTopic', SubTopicSchema);