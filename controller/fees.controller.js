import { Fees } from "../model/fees.model.js"
import { Student } from "../model/student.model.js";
import { Course } from '../model/course.model.js'

export const addFees = async (req, res) => {
    try {
        const { name, phone, courseId, amount, remark } = req.body
        const userId = req.user
        if (!name || !phone || !courseId || !amount || !remark) {
            return res.status(404).json({
                success: false,
                message: "Something is mising!"
            })
        }
        const student = await Student.findOne({ phone, courseId })
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Wrong phone no or course!"
            })
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Please select valid Course!",
            });
        }
        await Fees.create({ name, phone, courseId, userId, amount, remark })
        return res.status(201).json({
            success: true,
            message: "Payment Successful!"
        })
    } catch (error) {
        console.log(error);
    }
}

export const allPayment = async (req, res) => {
    try {
        const payment = await Fees.find({ userId: req.user })
        return res.status(200).json({
            success: true,
            payment
        })
    } catch (error) {
        console.log(error);
    }
}

export const paybyStudent = async (req, res) => {
    try {
        let payment = await Fees.find({ userId: req.user, courseId: req.query.courseId, phone: req.query.phone })
        return res.status(200).json({
            success: true,
            payment
        })
    } catch (error) {
        console.log(error);
    }
}




