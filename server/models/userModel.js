const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum:["Admin","Student","Instructor"],
        required: true
    },
    active: {
        type: Boolean
    },
    approve: {
        type: Boolean
    },
    token:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    },
    courses: [{
        type: mongoose.Schema.Types.objectId,
        ref: "course"
    }],
    profile: {
        type: mongoose.Schema.Types.objectId,
        ref: "profile"
    },
    courseProgress: [{
        type: mongoose.Schema.Types.objectId,
        ref: "courseProgress"
    }]



})

const user = mongoose.model("user",userSchema);
module.exports = user;