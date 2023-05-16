const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');

const User = require('../modal/user.modal')
const helper = require('../helper/helper');

const con = require('../config/db.cofig');
const user = require('../modal/user.modal');

const mail =require('./mailer')
/**
 *URL : http://localhost:8080/api/register
 *  Method : POST
 *  body={
 *  username : "iam_ab",
 *  password : "12345678",
 *  profile : "base64",
 *  email : "abc@gmail.com"
 * }
 *  */
exports.register = async (req, res) => {
    try {
        const { username, password, profile, email } = req.body;

        let users = await User.addUser(username, password, profile, email)
        res.status(users.statusCode).json({
            success: users.success,
            message: users.message,
            statusCode: users.statusCode
        })
    } catch (error) { 
        console.log(error.message);
        return res.status(500).send(error.message)
    }

}

/**
 *URL : http://localhost:8080/api/login
 *  Method : POST
 *  body={
 *  username : "iam_ab",
 *  password : "12345678",
 * }
 *  */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        let users = await User.login(username, password)
        res.status(users.statusCode).json({
            success: users.success,
            message: users.message,
            statusCode: users.statusCode,
            token: users.token,
            data: users.data
        })
    } catch (error) {
        return res.status(500).send(error)
    }
}

/**
 *  URL : http://localhost:8080/api/user/:username
 *  Method : GET
 *  Body parms : username
 *  */
exports.getUser = async (req, res) => {
    const { username } = req.params;
    try {

        if (!username) return res.status(501).json({
            statusCode: 501, //501 - required to fulfill the request
            success: false,
            message: "Invalid user name !"
        })
        let query = `SELECT u.id, u.username, u.email, u.profile, u.created_at, u.updated_at, u.deleted_at 
        FROM users AS u
        WHERE u.username = '${username}';`
        con.query(query, (err, result) => {
            if (!err) {
                console.log(result);
                if (result.length != 0) {

                    res.status(200).json({
                        statusCode: 200,
                        success: true,
                        message: "success",
                        data:  { user: result[0] }
                    })
                } else {
                    res.status(400).json({
                        statusCode: 400,
                        success: false,
                        message: "Can't find user "
                    })
                }
            } else {
                res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: err
                })
            }

        })
    } catch (error) {

    }
}
/**updating user */
exports.updateUser = async (req, res) => {
    console.log("heyy");
    try {
        const { userId } = req.user;
    console.log(userId);
        if (userId) {
            const { firstName, lastName, email, mobile, address, profile } = req.body;

            console.log(userId);
            let sqlQuery = `SELECT * FROM details d
                            WHERE d.userId = ${userId}`;
            con.query(sqlQuery, async (err, result) => {
          console.log("gssdfgsd");
            let emailVarify = await helper.isvalidEmail(email)
            if (emailVarify) {
         console.log(result);
                    if (result.length === 0) {
                        // let query = `CALL insertUserDetails()`;
                    let query = `UPDATE users u 
                                 SET u.email = '${email}'
                                 WHERE u.id = ${userId} `
                     con.query(query,(err,result)=>{
                        if(!err){
                                 let insertQuery = `INSERT INTO details(details.userId,details.first_name,details.last_name,details.email,details.mobile,details.address,details.profile) 
                                            VALUES(${userId},'${firstName}','${lastName}','${email}','${mobile}','${address}','${profile}');`
                                 con.query(insertQuery, (err, result) => {
                            
                                        if (err) throw err.message
                                        res.status(201).json({  
                                            statusCode: 201,
                                            success: true,
                                            message: "Added succefully"
                                        })
                        })
                        }
                     })            

          
                    } else {  

                        let query = `UPDATE users u 
                        SET u.email = '${email}'
                        WHERE u.id = ${userId} `
            con.query(query,(err,result)=>{
                        // update the data
                        let query = `UPDATE details d
                     SET d.first_name = '${firstName}' ,d.last_name = '${lastName}', d.mobile = '${mobile}', d.profile = '${profile}', d.address = '${address}' ,d.email = '${email}'
                     WHERE d.email = '${email}'`;
                        con.query(query, (err, result) => {
                            if (!err) {
                                console.log(result);
                                res.status(201).json({
                                    statusCode: 201,
                                    success: true,
                                    message: "updated succesfully"
                                }) 
                      
                            } else {
                                res.status(500).json({
                                    statusCode: 500,
                                    success: false,
                                    message: err.message
                                })
                            }
                        })
                    }) 
                  }
         } else {

                    res.status(400).json({
                        statusCode: 400,
                        success: false,
                        message: "Invalid email !"
                    })
               }
            })




        } else {
            console.log("##### userId is not found.");
        }
    } catch (err) {

        return res.status(404).json({
            statusCode: 404,//Client request not been compleated
            success: false,
            message: err.message
        })
    }

}

/** generate OTP */
exports.generateOTP = async (req, res) => {
    // Generate otp
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).json({
        statusCode: 201,
        success: true,
        message: " OTP generated ",
        code: req.app.locals.OTP
    })

}
/**verify OTP */
exports.verifyOTP = async (req, res) => {
    const { code, username } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null //reset the otp value
        req.app.locals.resetSession = true //start session for reset password
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: " Verification succefully "
        })

    } else {
        res.status(400).json({
            statusCode: 400,
            success: false,
            message: " invalid OTP !"
        })
    }
}
/** success fully redirect user when OTP is valid */
exports.createResetSession = async (req, res) => {
    try {
        if (req.app.locals.resetSession) {

            res.status(201).json({
                statusCode: 201,
                success: true,
                message: " access granted "
            })
        } else {
            res.status(440).json({
                statusCode: 440,
                success: false,
                message: " access denied "
            })
        }

    } catch (err) {
        console.log("ff", err);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: err.message
        })
    }


}
/** update the password when we have valid session */
exports.resetPassword = async (req, res) => {

    try {
        //

        if (req.app.locals.resetSession) {


            const { username, password } = req.body;
            try {
                let query = `SELECT * FROM users u
                             WHERE u.username = '${username}'`
                con.query(query, (err, result) => {
                    if (result[0] != 0) {
                        bcrypt.hash(password, 10)
                            .then((hash) => {
                                let query = `UPDATE users u
                                             SET u.password = '${hash}'
                                             WHERE u.username = '${username}'`
                                con.query(query, (err, success) => {
                                    if (err) throw err.message
                                    req.app.locals.resetSession = false;
                                    res.status(201).json({
                                        statusCode: 201,
                                        success: false,
                                        message: "Password updated successfully"
                                    })
                                })
                            }).catch((err) => {
                                res.status(500).json({
                                    statusCode: 500,
                                    success: false,
                                    message: "Enable to hash password"
                                })
                            })

                    }


                })



            } catch (err) {
                res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: err.message
                })
            }
        } else {
            res.status(440).json({
                statusCode: 440,
                success: false,
                message: "Session expired "
            })

        }

    } catch (err) {
        res.status(401).json({
            statusCode: 401,
            success: false,
            message: err.message
        })
    }

}

exports.getUserDetails = async (req, res) => {

    try {
        const { userId } = req.query;
        console.log("YY", userId);  
        if (!userId) return res.status(501).json({
            statusCode: 501, //501 - required to fulfill the request
            success: false,
            message: "Invalid user id !"
        })


        let query = `SELECT d.id, d.first_name, d.last_name, d.mobile,d.profile,d.address,u.email
            FROM details AS d ,users u
            WHERE d.userId = ${userId} AND d.email = u.email`

        con.query(query, (err, result) => {

            // console.log("RR", result);
            if (result.length === 0) {
                res.status(200).json({
                    statusCode: 200,
                    success: true,
                    message: "This is a new user ,So user dous'nt have profile details"
                })
            } else {
                res.status(200).json({
                    statusCode: 200,
                    success: true,
                    message: "This user have allredy profile details",
                    data: [
                        { result: result[0] }
                    ]
                })
            }
        })



    } catch (err) {
        res.status(401).json({
            statusCode: 401,
            success: false,
            message: err.message
        })
    }

}



exports.checkEmail = async (req,res)=>{
    try{
        const { text,userEmail,subject } = req.body;
       const   OTP  = req.app.locals.OTP
       console.log(userEmail,OTP,text,subject);
        await mail.SendGeneratedOTPCode(userEmail,OTP,text,subject).then((result)=>{
            console.log(result);
        }).catch((err)=>{
            console.log(err);
        })
    }catch(err){

    }
}

exports.generateLink = async (req,res)=>{
    try{
    const {username} = req.params
    let token = jwt.sign({username},process.env.SECRET_KEY,{expiresIn : '59s'})
            const link =`http://localhost:8080/resetLink/${token}` 


    }catch(err){
        console.log(err);
    }
}


