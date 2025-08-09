import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config({})

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLODINARY_KEY,
    api_secret:process.env.CLODINARY_SECRET
})

export default cloudinary;