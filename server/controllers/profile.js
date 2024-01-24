const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.updateProfile = async (req,res)=>{
    try{
       const {gender, dob="", about="", contactNumber} = req.body;
   
       //validate
       if(!gender || !dob || !about || !contactNumber){
         return res.status(401).json({
            success: false,
            message: "Fill all mandatory fields"
         })
       } 
       //extract image
       const image = req.files.profileImage;
       //upload image on cloudinary
       const uploadedImage = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);

       //get userId
       const userId = req.userId;
       //get profileId from User using userId
       const userDetails = await User.findById({userId});
       const profileId = userDetails.profile;
       //update profile using profileId
       const updatedProfile = await Profile.findByIdAndUpdate(profileId,{gender:gender,dob:dob,about:about,contactNumber:contactNumber,image:uploadedImage.secure_url},{new:true});
       //return response
       return res.status(200).json({
        success: true,
        data: updatedProfile,
        message: "Profile updated successfully"
       })

    }
    catch(err){
       return res.status(500).json({
        success: false,
        message: "Something went wrong"
       })
    }
}

exports.deleteUser = async (req,res) =>{
    try{
      const userId = req.userId;

      //find user from profile and delete
      const userDetails = await User.findById({userId});
      //get profile id from user collection
      const profileId = userDetails.profile;
     
      //delete profile
      const deletedProfile = await Profile.findByIdAndDelete({_id:profileId});

      //delete user
      const deletedUser = await User.findByIdAndDelete({_id: userId});

      //response
      return res.status(200).json({
        success: true,
        message: "User Deleted successfully"
      })
       
    } 
    catch(err){
      return res.status(500).json({
        success: false,
        message: "Something went wrong"
      })
    }
}

exports.getAllUserDetails = async (req,res) =>{
    try{
      const id = req.userId;

      const userDetails = await User.findById(id).populate("profile").exec();

      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        userDetails
      })
    }
    catch(err){
      return res.status(500).json({
        success: false,
        message: "Something went wrong"
      }
      )
    }
}