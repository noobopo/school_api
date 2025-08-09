import express from 'express'
import { createCourse, deleteCourse, getCourseById, getCourseByUser, latestCourse, updateCourse } from '../controller/course.controller.js'
import { isAuthonticated } from '../middleware/Auth.js'
const router = express.Router()

router.post('/create', isAuthonticated, createCourse)
router.get('/getmycourse', isAuthonticated, getCourseByUser)
router.get('/latestcourse', isAuthonticated, latestCourse)
router.get('/coursedetail/:id', isAuthonticated, getCourseById)
router.delete('/delete/:id', isAuthonticated, deleteCourse)
router.put('/update/:id', isAuthonticated, updateCourse)

export default router