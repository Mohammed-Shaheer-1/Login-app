const express = require('express');
const router = express.Router()

/**import all controllers */
const controller = require('../controller/auth.controller')



/**POST Metheods */
router.route('/register').post(controller.register)//register user
// router.route('/registerMail').post()//send the mail
router.route('authenticate').post((req,res)=>res.end())//authenticate user
router.route('/login').post(controller.login)//login app


/**GET Metheods */
router.route('/user/:username').get(controller.getUser)//get user
router.route('/generateOTP').get(controller.generateOTP)//generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP)//verify genrated  OTP
router.route('/createResetSession').get(controller.createResetSession)//reset all variables

/**PUT Metheods */
router.route('/updateUser').put(controller.updateUser)//is use to update user profile
router.route('/resetPassword').put(controller.resetPassword)//is use to reset password

module.exports=router;
