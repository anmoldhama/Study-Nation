const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
        required:true
    },
    instructors:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    }],
    whatYouWillLearn:{
        type: String,
        required: true
    },
    courseContents:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "section"
    }],
    ratingAndReviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ratingAndReview"
    }],
    price:{
        type: Number
    },
    thumbnail:{
        type: String
    },
    categorys:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }],
    tags:{
        type: string
    },
    studentsEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
})

const course = mongoose.model("course",courseSchema);
module.exports = course;