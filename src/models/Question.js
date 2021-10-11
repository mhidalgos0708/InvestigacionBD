const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema ({
    statement: { type: String, require: true },
    option1: { type: String, require: true },
    option2: { type: String, require: true },
    option3: { type: String, require: true },
    option4: { type: String, require: true },
    correctoption: { type: String, require: true },
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Question', QuestionSchema);