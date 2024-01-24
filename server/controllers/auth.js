const otpGenerator = require("otp-generator");
const OTP = require('../models/otpModel');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const mailSender = require('../utils/mailSender');

exports.sendOTP = async (req, res) => {
    try {

        //fetch email from request body
        const { email } = req.body;

        //check if user already exist 
        const checkUserExist = await User.findOne({ email });

        //if exist then return response
        if (checkUserExist) {
            return res.status(401).json({
                success: false,
                message: "User already exist"
            })
        }

        // generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            SpecialChars: false
        });
        console.log("otp: ", otp);

        //find otp already exist
        const result = await OTP.findOne({ otp: otp });

        //resend otp if exist
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                SpecialChars: false
            });
            result = await OTP.findOne({ otp: otp });
        }

        // create payload to insert in db
        const payload = { email, otp };

        // insert otp in db
        const otpBody = await OTP.create(payload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp

        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }


    // match otp with the entered otp
    // if match save user

}

exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, password, confirmPassword, accountType, otp } = req.body;

        if (!firstName || !lastName || !email || !contactNumber || !password || !confirmPassword || !accountType || !otp) {
            return res.status(401).json({
                success: false,
                message: "please fill all mandatory fields"
            })
        }
        //check user already exist or not
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(401).json({
                success: false,
                message: "User already exist"
            })
        }

        //match passwords
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "password and confirm not matched"
            })
        }
        //fetch most recent otp
        const recentOtp = await OTP.find({ email }).sort({ created: -1 }).limit(1);

        //validate OTP
        if (recentOtp.length == 0) {
            return res.status(401).json({
                success: false,
                message: "OTP not found"
            })
        }

        if (otp !== recentOtp) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //insert in db
        const profileDetails = await Profile.create({
            gender: null,
            dob: null,
            about: null,
            contactNumber: contactNumber,
            image: `https://api ${firstName} ${lastName}`
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            profile: profileDetails._id
        })

        //return response
        return res.status(200).json({
            success: true,
            message: "user registered successfully",
            user
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validate
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: "All fields are mandatory"
            })
        }
        //check user exist or not
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered please SignUp first"
            })
        }

        //decrypt password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Check if the password is valid
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        //generate JWT token
        const payload = {
            userId: user._id.toString(),
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            accountType: user.accountType
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"
        });
        user.token = token;
        user.password = undefined;

        //set cookies
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        res.cookies("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: 'Logged in successfully'
        })

        // Store user information in the session


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed"
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        //fetch req body
        const { userId, currentPassword, newPassword, confirmPassword } = req.body;

        //check all mandatory fields
        if (!userId || !currentPassword || !newPassword || !confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Fill all mandatory fields"
            })
        }
        //check current password is matched in db
        const user = await User.findOne({ _id: userId });

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current Password is not correct"
            })
        }

        //check new password and current password is not matched
        if (newPassword === currentPassword) {
            return res.status(401).json({
                success: false,
                message: "New password and Current password should be different"
            })
        }

        //check new password and confirm password should same
        if (newPassword !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "New password and Confirm password should be same"
            })
        }
        //insert new password in db
        const updatedPassword = await User.findByIdAndUpdate({ _id: userId }, {
            newPassword
        })

        if (!updatedPassword) {
            return res.status(401).json({
                success: false,
                message: "Password not updated"
            })
        }

        //send mail password
        const mailResponse = await mailSender(user.email, "Password changed successfully: ", newPassword);

        if (!mailResponse) {
            return res.status(401).json({
                success: false,
                message: "Mail not send"
            })
        }
        //return response
        return res.status(200).json({
            success: true,
            message: " updated Password sent to the registered mail id"
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}