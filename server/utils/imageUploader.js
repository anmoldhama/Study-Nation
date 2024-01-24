const cloudinary = rquire("cloudinary").v2

exports.uploadImageToCloudinary = async (req,res)=>{
    const options = {folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}