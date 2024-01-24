const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel');

//auth
exports.auth = async (req, res, next) => {
    try {
        //get token
        const token = req.cookies.token
            || req.body.token
            || req.header("Authorisation").replace("Bearer ", "");

        //if token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        //verify token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Token is invalid"
            })
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//is student
exports.isStudent = async (req,res,next)=>{
    try{
       if(req.user.accountType !== "Student"){
        return res.status(401).json({
            success: false,
            message: "This is a protected route only for students"
        })
       }


    }
    catch(error ){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}