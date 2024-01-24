const Subsection = require("../models/subSectionModel");
const Section = require("../models/sectionModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req,res) =>{
    try{
    
      const {sectionId, title, timeDuration, description, additionalUrl} = req.body;
     
      //extract video
      const video = req.files.videoFiles;

      //validate
        if(!sectionId || !title || !timeDuration || !description ){
        return res.status(401).json({
            success: false,
            message:"Fill All Mandatory fields"
        })
      }

    // upload to cloudinary
      const uploadedVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

      //payload to create sub section
      const subSectionPayload ={
        title,
        timeDuration,
        description,
        additionalUrl,
        videoUrl: uploadedVideo.secure_url
      };

     //insert data in subSection collection
      const createdSubSection = await Subsection.create({subSectionPayload});

     //update section data
     const updatedSection = await Section.findByIdAndUpdate(createdSubSection._id,{ $push: { subSection: createdSubSection._id } },
        { new: true })

    //return response
     return res.status(200).json({
        success: true,
        message: "Sub Section added successfully"
     })


    }
    catch(err){
      return res.status(500).json({
        success: false,
        message: "Something went wrong"
      })
    }
}