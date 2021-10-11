const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSessionSchema = new Schema ({
    user: {type: String, require: true},
    currentcourse: {type: String, require: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('CourseSession', CourseSessionSchema);