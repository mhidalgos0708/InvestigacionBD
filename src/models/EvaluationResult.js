const mongoose = require('mongoose');
const { Schema } = mongoose;

const EvaluationResultSchema = new Schema ({
    course: {type: String, require: true},
    name: {type: String, require: true},
    user: {type: String, require: true},
    score: {type: String, require: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('EvaluationResult', EvaluationResultSchema);