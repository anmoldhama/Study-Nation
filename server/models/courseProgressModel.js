const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
    courseIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    }],
    completedVideos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subSection"
    }]
})

const courseProgress = mongoose.model("courseProgress",courseProgressSchema);
module.exports = courseProgress;