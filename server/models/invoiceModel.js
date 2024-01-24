const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    courseName:{
        type: String
    },
    price:{
        type: Number
    },
    address:{
        type: String
    },
    pincode:{
        type: String
    },
    courseIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    }]
})

const invoice = mongoose.model("invoice",invoiceSchema);
module.exports = invoice;