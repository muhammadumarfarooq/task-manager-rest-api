const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        truncate: true,
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const Task = mongoose.model('task', taskSchema);

module.exports = Task;