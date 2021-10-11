const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSchema = new Schema ({
    teacher: {type: String, require: true},
    code: { type: String, require: true },
    name: {type: String, require: true },
    description: {type: String, require: true},
    startdate: {type: Date, require: true },
    enddate: {type: Date, require: false },
    photo: {type: String, require: true },
    state: {type: String, require: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Course', CourseSchema);