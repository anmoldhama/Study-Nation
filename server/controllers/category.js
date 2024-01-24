const Category = require("../models/categoryModel");


exports.createCategory = async (req,res)=>{
    try{
        //fetch body data
       const {name, description } = req.body;

       //validate
       if(!name || !description){
        return res.status(401).json({
            success: false,
            message: "Fill all mendatory fields"
        })
       }
       //check tag name is already exist or not
       const categoryExist = await Category.find({name});

       if(categoryExist){
        return res.status(401).json({
            success: false,
            message: "Category name already exist"
        })
       }
       //insert entry in db
       const insertedCategory = await Category.create({name:name,description:description});

       //return response
       return res.status(200).json({
        success: true,
        data: insertedCategory,
        message: "Tag added successfully"
       })

    }
    catch(error){
       return res.status(500).json({
        success: false,
        message: error.message
       })
    }
}

exports.getAllCategorys = async (req,res)=>{
    try{
       const response = await Category.find({}, {name: true, description: true});

       return res.status(200).json({
        success: true,
        data: response,
        message: "Categorys fetched successfully"
       })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}