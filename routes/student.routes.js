import express from 'express'
import { addStudent, deleteStudent, getCourseStudent, getOwnStudent, getStudentById, latestStudents, updateStudent } from '../controller/student.controller.js'
import { isAuthonticated } from '../middleware/Auth.js'

const router = express.Router()
router.post('/register',isAuthonticated,addStudent)
router.get('/getmystudent',isAuthonticated,getOwnStudent)
router.get('/details/:id',isAuthonticated,getStudentById)
router.get('/lateststudent',isAuthonticated,latestStudents)
router.get('/allstudent/:id',isAuthonticated,getCourseStudent)
router.delete('/delete/:id',isAuthonticated,deleteStudent)
router.put('/update/:id',isAuthonticated,updateStudent)

export default router