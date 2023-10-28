const userController=require('../controllers/userController')
const express=require('express')
router=express.Router()
router.get('/validate-token',userController.validateToken)
router.post('/',userController.createAccount)
router.get('/login',userController.loginUser)
router.get('/recover-account',userController.createVerificationCode)
module.exports=router