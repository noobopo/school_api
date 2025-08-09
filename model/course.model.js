import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required:true
    },
    imageId: {
        type: String,
        required:true
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true })

export const Course = mongoose.model("Course", courseSchema)
