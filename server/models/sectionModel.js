const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    sectionName:{
        type: String,
        required: true
    },
    subSection:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"subSection"
    }]
})

const section = mongoose.model("section",sectionSchema);
module.exports = section;