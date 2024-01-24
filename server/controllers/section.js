const Section = require("../models/sectionModel");
const Course = require("../models/courseModel");

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(401).json({
                success: false,
                message: "Fill all mandatory fields"
            })
        }

        const createdSection = await Section.create({ sectionName: sectionName });

        const updatedCourse = await Course.findOneAndUpdate({ _id: courseId }, { $push: { courseContents: createdSection._id } },
            { new: true })
            .populate({
                path: "courseContents",
                populate: {
                    path: "subSection"
                },
            })
            .exec();

        //return response
        return res.status(200).json({
            success: true,
            message: "Section added successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

exports.updateSection = async (req,res)=>{
    try{
        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(401).json({
                success: false,
                message: "Fill All Mandatory Fields"
            })
        }

        const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        //return response
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

exports.deleteSection = async (req,res)=>{
    try{
       const {sectionId} = req.params;

       const deletedSection = await Section.findByIdAndDelete({sectionId});

       return res.status(200).json({
        success: true,
        message: "Section deleted successfully"
       })
    }
    catch(err){
       return res.status(500).json({
        success: false,
        message: "something went wrong"
       })
    }
}