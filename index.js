import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/user.routes.js'
import feesRouter from './routes/fees.routes.js'
import studentRouter from './routes/student.routes.js'
import courseRouter from './routes/course.routes.js'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import mongoose from 'mongoose'
import cors from 'cors'

dotenv.config({})
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173/", 
  credentials: true,
  methods: ["POST", "GET", "PUT", "DELETE"]
}));

app.use(fileUpload({
    useTempFiles : true
}));

app.use('/api/v1/user',userRouter)
app.use('/api/v1/course',courseRouter)
app.use('/api/v1/fees',feesRouter)
app.use('/api/v1/student',studentRouter)

mongoose.connect(process.env.MONGO_URI,{
    dbName:"school"
}).then(()=>{
    console.log("Database connected"); 
})

const port = process.env.PORT || 6000
app.listen(port,()=>{
    console.log(`server running on ${port}`);
})