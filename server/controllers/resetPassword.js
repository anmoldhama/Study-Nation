const user = require("../models/userModel");
const User = require("../models/userModel");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {

        //get email for req body
        const email = req.body.email;

        //check user for this email, email validation
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "your email is not registered with us"
            })
        }

        //generate token
        const token = crypto.randomUUID();

        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        );

        //crate url
        const url = `http://localhost:3000/update-password/${token}`;

        //send mail containing the url
        await mailSender(email,
            "Password Reset Link",
            `Password Reset Link: ${url}`);

        //return response
        return res.json({
            success: true,
            message: "Email sent successfully, please check email and change pwd"
        });



    }
    catch (error) {
        return res.status(501).json({
            success: false,
            message: error.message
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        // fetch data
        const { password, confirmPassword, token } = req.body;

        //validations
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password not matching"
            })
        }

        //get userdetails from db using token
        const userDetails = await User.findOne({ token: token });

        //if no entry - invalid token
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is invalid"
            })
        }

        //token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "Token is expired, please regenerate token"
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //password update
        const updatedPassword = await User.findOneAndUpdate({ token: token }, {
            hashedPassword
        });

        //return response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}