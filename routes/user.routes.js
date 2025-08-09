import express from 'express'
import { updateUser, userLogin, userLogout, userProfile, userRegister } from '../controller/user.controller.js'
import { isAuthonticated } from '../middleware/Auth.js'

const router = express.Router()

router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/profile',isAuthonticated,userProfile)
router.get('/logout',userLogout)
router.put('/update',isAuthonticated,updateUser)

export default router