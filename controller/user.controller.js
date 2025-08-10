import cloudinary from '../config/cloudinary.js'
import { User } from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            })
        }
        let imageUrl = ""
        let imageId = ""
        if (req.files?.image?.tempFilePath) {
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath)
            imageUrl = result.secure_url
            imageId = result.public_id
        }
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist!"
            })
        }
        const hasePass = await bcrypt.hash(password, 10)
        await User.create({ name, email, password: hasePass, imageUrl, imageId })
        return res.status(201).json({
            success: true,
            message: "User register successfully!"
        })
    } catch (error) {
        console.log(error);
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: "1d" });

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000
            })
            .json({ success: true, message: `Welcome back ${user.name}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const userLogout = async (req, res) => {
    try {
        return res.cookie("token", "", {
            expires: new Date(0)
        }).json({
            success: true,
            message: "user logged out!"
        })
    } catch (error) {
        console.log(error);
    }
}

export const userProfile = async (req, res) => {
    try {
        const id = req.user
        let user = await User.findById(id).select("-password")
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const hasePass = await bcrypt.hash(password, 10)
        const userId = req.user
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid Id"
            })
        }
        if (req.files) {
            await cloudinary.uploader.destroy(user.imageId)
            const reasult = await cloudinary.uploader.upload(req.files.image.tempFilePath)
            let imageUrl = reasult.secure_url
            let imageId = reasult.public_id
            await User.findByIdAndUpdate(userId, { name, email, password: hasePass, imageUrl, imageId }, { new: true })
            return res.status(200).json({
                success: true,
                message: "User Updated!"
            })
        } else {
            let imageUrl = user.imageUrl
            let imageId = user.imageId
            await User.findByIdAndUpdate(userId, { name, email, password: hasePass, imageUrl, imageId }, { new: true })
            return res.status(200).json({
                success: true,
                message: "User Updated!"
            })
        }
    } catch (error) {
        console.log(error);
    }
}