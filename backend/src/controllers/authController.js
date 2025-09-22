import { generateToken } from "../../utils/generateToken.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";


export const signUp = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({
                success:false,
                message: "Please provide all required fields"
            })
        }

        if(password.length < 6) {
            return res.status(400).json({
                success:false,
                message: "password must be at least 6 characters long"
            })
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                success:false,
                message: "User already exists"
            })
        }
        const salt =  await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser =  new User({
            fullName,
            email,
            password: hashedPassword
        })
        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                success:true,
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
            })
            
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message: "Server Error"
        })
        
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Please provide all required fields"
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message: "Invalid credentials"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message: "Invalid credentials"
            })
        }
        generateToken(user._id, res)
        res.status(200).json({
            success:true,
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message: "Server Error"
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", "", {maxAge: 0});
        res.status(200).json({
            success:true,
            message: "User logged out"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message: "Server Error"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(404).json({
                success:false,
                message: "profile pic not found"
            })
        }
        
       const uploadRes = await cloudinary.uploader.upload(profilePic)
       
       const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadRes.secure_url}, {new:true})
       res.status(200).json({
        success:true,
        user: updatedUser
       })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message: "Server Error"
        })
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({
            success:true,
            user: req.user
        })
    } catch (error) {
        console.log("error in check auth controller", error);
        res.status(500).json({
            success:false,
            message: "Server Error"
        })
    }
}
