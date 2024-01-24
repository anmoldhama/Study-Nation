const {instance} = require("../config/razorpay");
const Course = require("../model/Course");
const User = require("../models/userModel");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");


//capture rhe payment and initiate the razorpay order

exports.capturePayment = async (req,res)=>{
    //get courseId and userId
    const {course_id} = req.body;
    const userId = req.userId;
    //validate
    if(!course_id){
        return res.status(401).json({
            success: false,
            message: "Please provide valid course id"
        })
    }
    //valid courseId
    let course;
    try{
         course = await Course.findById({course_id});
         if(!course){
            return res.json({
                success: false,
                message:"could not find the course"
            })
         }
    
    
    //valid courseDetail

    //user already pay for the same course
     const uid = new mongoose.Types.ObjectId(userId);
     if(course.studentEnrolled.includes(uid)){
        return res.status(200).json({
            success: true,
            message: "Student is already enrolled"
        })
     }
    }
     catch(error){
      return res.status(500).json({
        success: false,
        message: "Something went wrong"
      })
     }
    //order create
    const amount = course.price;
    const currency= "INR";

    const options = {
        amount : amount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId
        }
    };

    try{
     const paymentResponse = await instance.orders.create(options);
     console.log(paymentResponse);

     return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount
     })
    }
    catch(err){
      return res.status(500).json({
        success: false,
        message:"Could not initiate order"
      })
    }
    //return response

}


//verify signature

exports.verifySignature = async (req,res)=>{
    const webhookSecret = "123456";

    const signature = req.headers["x-razorpay-signature"];

    const shaSum = crypto.createHmac("sha256", webhookSecret);
    shaSum.update(JSON.stringify(req.body));
    const digest = shaSum.digest("hex"); 

    if(signature     === digest){
        console.log("payment is authorised");

        const {courseId, userId} = req.bodu.payload.payment.entity.notes;

        try{
          //fulfil the action
          //find the course and enroll the student in it
          const enrolledCourse = await Course.findOneAndUpdate(
            {_id: courseId},
            {$push:{studentsEnrolled: userId}},
            {new: true}
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "course not found"
                })
            }
            console.log(enrolledCourse);

            //find the student and add the course to their list of enrolled courses
            const enrolledStudents = await User.findOneAndUpdate(
                {_id: userId},
                {$push:{courses:courseId}},
                {new: true}
            );
            console.log(enrolledStudents);

            //mail send to confirmation id
            const emailResponse = await mailSender(
                enrolledStudents.email,
                "Congratulations", 
                "Congratulations, you are onboarded into new Course"
            );

            return res.status(200).json({
                success: true,
                message: "Signature Verified and Course added"
            })
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid JSON"
        })
    }
}