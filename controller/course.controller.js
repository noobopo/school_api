import cloudinary from "../config/cloudinary.js";
import { Course } from "../model/course.model.js";
import { Student } from "../model/student.model.js";

export const createCourse = async (req, res) => {
    try {
        const { title, price, description, startDate, endDate } = req.body
        const reasult = await cloudinary.uploader.upload(req.files.image.tempFilePath)
        const imageUrl = reasult.secure_url
        const imageId = reasult.public_id
        const user = req.user
        if (!title || !price || !description || !startDate || !endDate || !imageUrl || !imageId) {
            return res.status(404).json({
                success: false,
                message: "Something is missing!"
            })
        }
        let course = await Course.findOne({ title })
        if (course) {
            return res.status(404).json({
                success: false,
                message: "Course Already Exist!"
            })
        }
        await Course.create({ title, price, description, startDate, endDate, imageUrl, imageId, userId: user })
        return res.status(201).json({
            success: true,
            message: "New Course Created!"
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCourseByUser = async (req, res) => {
    try {
        const userId = req.user
        const course = await Course.find({ userId })
        return res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCourseById = async (req, res) => {
    try {
        const id = req.params.id
        const course = await Course.findById(id)
        const students = await Student.find({ courseId: id })
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not Found"
            })
        }
        return res.status(200).json({
            success: true,
            course,
            students
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteCourse = async (req, res) => {
    try {
        let course = await Course.findById((req.params.id))
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Invalid Id!"
            })
        }
        if (req.user.toString() !== course.userId.toString()) {
            return res.status(404).json({
                success: false,
                message: "You Can`t Delete This course"
            })
        } else {
            await Student.deleteMany({ courseId: req.params.id })
            await Course.findByIdAndDelete(req.params.id)
            await cloudinary.uploader.destroy(course.imageId)
            return res.status(200).json({
                success: true,
                message: "Course deleted successfully!"
            })
        }

    } catch (error) {
        console.log(error);
    }
}

export const updateCourse = async (req, res) => {
    try {
        const { title, price, description, startDate, endDate } = req.body
        const course = await Course.findById(req.params.id)
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Invalid Id!"
            })
        }
        if (req.user.toString() !== course.userId.toString()) {
            return res.status(401).json({
                success: false,
                message: "You can`t update this course"
            })
        }
        if (req.files) {
            await cloudinary.uploader.destroy(course.imageId)
            const reasult = await cloudinary.uploader.upload(req.files.image.tempFilePath)
            const imageUrl = reasult.secure_url
            const imageId = reasult.public_id
            await Course.findByIdAndUpdate(req.params.id, { title, price, description, startDate, endDate, imageUrl, imageId }, { new: true })
            return res.status(200).json({
                success: true,
                message: "Course Updated!"
            })
        } else {
            const imageId = course.imageId
            const imageUrl = course.imageUrl
            await Course.findByIdAndUpdate(req.params.id, { title, price, description, startDate, endDate, imageUrl, imageId }, { new: true })
            return res.status(200).json({
                success: true,
                message: "Course Updated!"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const latestCourse = async (req, res) => {
    try {
        const userId = req.user
        const courses = await Course.find({ userId }).sort({ $natural: -1 }).limit(5)
        return res.status(200).json({
            success: true,
            courses
        })
    } catch (error) {
        console.log(error);
    }
}

