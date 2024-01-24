const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        required: true,
        expires: 2*60
    }
});

async function sendVerificationEmail(email,otp){
    try{

        const mailResponse = await mailSender(email,"Verification Email from StudyNotion", otp);
        console.log("Email sent successfully",mailResponse);
    }
    catch{
        console.log("error occured while sending email",error);
        throw error;
    }
}

otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model("otp",otpSchema);