import mongoose from "mongoose";

const feesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true,
    },
    remark: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const Fees = mongoose.model("Fees", feesSchema)
