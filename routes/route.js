const express = require('express');
const router = express.Router()

/**import all controllers */
const controller = require('../controller/auth.controller')

const {verifyUser} = require('../middleware/user.middleware');
const {Auth,localVariables} = require('../middleware/auth.middleware')

        

/**POST Metheods */
router.route('/register').post(controller.register)//register user
// router.route('/registerMail').post()//send the mail
router.route('/authenticate').post(verifyUser,(req,res)=>res.end())//authenticate user
router.route('/login').post(verifyUser,controller.login)//login app


/**GET Metheods */
router.route('/user/:username').get(controller.getUser)//get user
router.route('/generateOTP').get(verifyUser,localVariables,controller.generateOTP)//generate random OTP
router.route('/verifyOTP').get(verifyUser,controller.verifyOTP)//verify genrated  OTP
router.route('/createResetSession').get(controller.createResetSession)//reset all variables
  
/**PUT Metheods */
router.route('/updateUser').put(Auth,controller.updateUser)//is use to update user profile
router.route('/resetPassword').put(verifyUser,controller.resetPassword)//is use to reset password

module.exports=router;
