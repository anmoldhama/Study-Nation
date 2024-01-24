const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender:{
        type: String,
    },
    dob:{
        type: String
    },
    about:{
        type: String,
        trim: true
    },
    contactNumber:{
        type: String,
        trim: true
    },
    image:{
        type: String,
        trim: true
    }
})

const profile = mongoose.model("profile",profileSchema);
module.exports = profile;