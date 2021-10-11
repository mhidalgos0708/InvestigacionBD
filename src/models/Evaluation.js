const mongoose = require('mongoose');
const { Schema } = mongoose;

const EvaluationSchema = new Schema ({
    course: { type: String, require: true },
    name: {type: String, require: true },
    startdate: {type: String, require: true },
    enddate: {type: String, require: true },
    questions: {type: Array, require: true },
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);