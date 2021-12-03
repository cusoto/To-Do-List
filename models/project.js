const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    project_name: {
        type: String,
        max: 32,
        trim: true,
        required: true
    },
    subprojects: [{
        description: {
            type: String,
            max: 32,
            required: true
        }
    }],
    completed_subprojects: [{
        description: {
            type: String,
            max: 32,
            required: true
        }
    }],
    completed: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Project', projectSchema);