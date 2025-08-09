import cloudinary from "../config/cloudinary.js";
import { Course } from "../model/course.model.js";
import { Student } from "../model/student.model.js";
import { Fees } from "../model/fees.model.js"

export const addStudent = async (req, res) => {
    try {
        const { name, phone, email, address, courseId } = req.body
        const userId = req.user
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath)
        const imageUrl = result.secure_url
        const imageId = result.public_id
        if (!name || !phone || !email || !address || !courseId || !imageUrl || !imageId) {
            return res.status(404).json({
                success: false,
                message: "Something is missing!"
            })
        }
        const student = await Student.findOne({phone:phone})
        if (student) {
            return res.status(400).json({
                success:false,
                message: "Phone no is Already exist!"
            })
        }
        await Student.create({ name, phone, email, address, imageUrl, imageId, courseId, userId })
        return res.status(201).json({
            success: true,
            message: "New Student Added!"
        })
    } catch (error) {
        console.log(error);
    }
}

export const getOwnStudent = async (req, res) => {
    try {
        const userId = req.user
        let students = await Student.find({ userId: userId })
        return res.status(200).json({
            success: true,
            students
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCourseStudent = async (req, res) => {
    try {
        const userId = req.user
        const courseId = req.params.id
        let students = await Student.find({ userId: userId, courseId: courseId })
        return res.status(200).json({
            success: true,
            students
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteStudent = async (req, res) => {
    try {
        let student = await Student.findById((req.params.id))
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Invalid Id!"
            })
        }
        if (req.user.toString() !== student.userId.toString()) {
            return res.status(404).json({
                success: false,
                message: "You Can`t Delete This student"
            })
        } else {
            await Student.findByIdAndDelete(req.params.id)
            await cloudinary.uploader.destroy(student.imageId)
            return res.status(200).json({
                success: true,
                message: "Student deleted successfully!"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const updateStudent = async (req, res) => {
    try {
        const { name, phone, email, address, courseId } = req.body
        const student = await Student.findById(req.params.id)
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Invalid Id!"
            })
        }
        if (req.user.toString() !== student.userId.toString()) {
            return res.status(401).json({
                success: false,
                message: "You can`t update this Student"
            })
        }
        if (req.files) {
            await cloudinary.uploader.destroy(student.imageId)
            const reasult = await cloudinary.uploader.upload(req.files.image.tempFilePath)
            const imageUrl = reasult.secure_url
            const imageId = reasult.public_id
            await Student.findByIdAndUpdate(req.params.id, { name, phone, email, address, courseId, imageUrl, imageId }, { new: true })
            return res.status(200).json({
                success: true,
                message: "Student data Updated!"
            })
        } else {
            const imageId = student.imageId
            const imageUrl = student.imageUrl
            await Student.findByIdAndUpdate(req.params.id, { name, phone, email, address, courseId, imageUrl, imageId }, { new: true })
            return res.status(200).json({
                success: true,
                message: "Student data Updated!"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const latestStudents = async (req, res) => {
    try {
        const userId = req.user
        const students = await Student.find({ userId }).sort({ $natural: -1 }).limit(3)
        return res.status(200).json({
            success: true,
            students
        })
    } catch (error) {
        console.log(error);
    }
}

export const getStudentById = async (req, res) => {
    try {
        const id = req.params.id
        const student = await Student.findById(id)
        if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid Id"
                })
            }
        const course = await Course.findById(student.courseId)
        const payments = await Fees.find({phone : student.phone })
        return res.status(200).json({
            success:true,
            student,
            course,
            payments
        })
    } catch (error) {
        console.log(error);
    }
}