const User = require('../modal/user.modal')
const helper = require('../helper/helper');

exports.register = async (req,res)=>{
    try{
        const { username, password, profile, email } = req.body;

        let users = await User.addUser(username,password,profile,email)
        res.status(users.statusCode).json({
            success : users.success,
            message : users.message,
            statusCode : users.statusCode
        })
    } catch (error) {
        return res.status(500).send(error)
    } 
    
}


exports.login = async (req,res)=>{
    try{
        const { username, password } = req.body;

        let users = await User.login(username,password)
        res.status(users.statusCode).json({
            success : users.success,
            message : users.message,
            statusCode : users.statusCode,
            token : users.token,
            data : users.data
        })
    } catch (error) {
        return res.status(500).send(error)
    } 
}


exports.getUser = async (req,res)=>{
    res.json('register route')
} 

exports.updateUser = async (req,res)=>{
    res.json('register route')
} 

exports.generateOTP = async (req,res)=>{
    res.json('register route')
} 

exports.verifyOTP = async (req,res)=>{
    res.json('register route')
} 

exports.createResetSession = async (req,res)=>{
    res.json('register route')
} 

exports.resetPassword = async (req,res)=>{
    res.json('register route')
} 
