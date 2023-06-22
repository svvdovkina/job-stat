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
        enum: ["applied", "interview", "declined"],
        default: "applied"
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide userId"],
    }

}, {timestamps: true})

module.exports = mongoose.model("Job", JobSchema);