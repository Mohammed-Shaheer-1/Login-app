const jwt = require('jsonwebtoken');
require('dotenv').config()

/**middleware authentication token */
exports.Auth=async(req,res,next)=>{
    try{
     /**Access autherize validate request */
     const token = req.headers.authorization;
     const decodedToken = await jwt.verify(token,process.env.SECRET_KEY)
     req.user = decodedToken
     next()
  

    }catch(err){
        return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "Authentication error ! "
        })
    }
}


exports.localVariables=(req,res,next)=>{
    req.app.locals = {
        OTP : null,
        resetSession : false 
    }
    next()
}