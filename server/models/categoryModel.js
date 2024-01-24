const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    }]
});

const category = mongoose.model("category",categorySchema);
module.exports = category;