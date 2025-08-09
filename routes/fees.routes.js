import express from 'express'
import { addFees, allPayment, paybyStudent } from '../controller/fees.controller.js'
import { isAuthonticated } from '../middleware/Auth.js'

const router = express.Router()

router.post('/pay',isAuthonticated,addFees)
router.get('/paymenthistory',isAuthonticated,allPayment)
router.get('/paybyone',isAuthonticated,paybyStudent)

export default router
