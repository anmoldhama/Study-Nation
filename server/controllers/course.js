const User = require("../models/userModel");
const Tag = require("../models/categoryModel");
const Course = require("../models/courseModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.createCourse = async (req, res) => {
    try {
        //fetch body
        const { courseName, courseDescription, whatYouWillLearn, price, tags } = req.body;

        //validate
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tags) {
            return res.status(401).json({
                success: false,
                message: "Fill all mandatory fields"
            })
        }

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //fetch instructor id 
        const userId = req.userId;

        const instructorDetails = await User.findById({ userId });

        if (!instructorDetails) {
            return res.status(401).json({
                success: false,
                message: "Instructor not found"
            })
        }

        //validate tag check in db
        const tagExist = await Tag.findById({ tags });

        if (!tagExist) {
            return res.status(401).json({
                success: false,
                message: "Tag not exist"
            })
        }

        //upload image on cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //add course entry in user 

        //insert in db inside course 
        const coursePayload = {
            courseName,
            courseDescription,
            instructors: instructorDetails._id,
            whatYouWillLearn,
            price,
            thumbnail: thumbnailImage.secure_url,
            tags: tagExist._id
        }
        const courseData = await Course.create({ coursePayload });

        //update courese id in course array inside user schema
        await User.findByIdAndUpdate({ _id: courseData._id }, { $push: { courses: courseData._id } },
            { new: true });
        //fetch and update courseid in tag
        const updatedTag = await Tag.findOneAndUpdate({ _id: tags }, { $push: { courses: courseData._id } },
            { new: true });

        //return response
        return res.status(200).json({
            success: true,
            message: "Course added successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

exports.getAllCourses = async (req,res)=>{
    try{
     const allCourses = await Courses.find({},{courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                 instructors: true,
                                                 })
                                                 .populate("instructor")
                                                 .exec();
     return res.status(200).json({
        success: true,
        message: "Course fetched successfully",
        course: allCourses
     })
    }
    catch(error){ 
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}