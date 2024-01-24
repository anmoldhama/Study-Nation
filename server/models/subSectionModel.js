const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    timeDuration:{
        type: String
    },
    description:{
        type: String
    },
    videoUrl:{
        type: String
    },
    additionalUrl:{
        type: String
    }

})

const subSection = mongoose.model("subSection",subSectionSchema);
module.exports = subSection;