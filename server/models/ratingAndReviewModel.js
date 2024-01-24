const mongoose = require('mongoose');

const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    rating:{
        type: Number
    },
    review:{
        type: String
    }
})

const ratingAndReview = mongoose.model("ratingAndReview",ratingAndReviewSchema);
module.exports = ratingAndReview;