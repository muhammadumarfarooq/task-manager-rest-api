const mongoose = require('mongoose');

const Task = mongoose.model('task', {
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

module.exports = Task;