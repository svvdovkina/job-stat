const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide company"],
        maxlength: 70
    },
    position: {
        type: String,
        required: [true, "Please provide position"],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ["pending", "interview", "declined"],
        default: "pending"
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide userId"],
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'internship'],
        default: 'full-time'
    },
    jobLocation: {
        type: String,
        default: "-",
        required: true
    }

}, {timestamps: true})

module.exports = mongoose.model("Job", JobSchema);