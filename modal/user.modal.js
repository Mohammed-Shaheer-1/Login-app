const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const con = require('../config/db.cofig')
const helper = require('../helper/helper')


module.exports = class user {
    constructor() { }
    static addUser(username, password, profile, email) {
        return new Promise((resolve, reject) => {
            //check the existing user
            let sql = `SELECT * FROM users u WHERE u.username = '${username}'`;
            let sqlQuery = `CALL verifyUser('${username}')`;
            let verifyUser = con.query(sqlQuery, async (err, success) => {
                if (!err) {
                    if (!success[0].length > 0) {
                        //generate hash password
                        const saltRounds = 10;
                        const salt = await bcrypt.genSalt(saltRounds);
                        const hash = await bcrypt.hash(password, salt);
                        if (hash) {
                            /**check the email is valid or not  */
                            let isvalidEmail = await helper.isvalidEmail(email)
                            if (isvalidEmail) {
                                //check the existing email
                                let queryEmail = `SELECT * FROM users u WHERE u.email = '${email}'`;
                                let verifyEmail = con.query(queryEmail, (err, success) => {
                                    if (!err) {
                                        console.log(success);
                                        if (!success.length > 0) {
                                            let sqlQuery = `CALL insertUsers('${username}','${hash}','${profile}','${email}')`;
                                            con.query(sqlQuery, (err, result) => {
                                                if (!err) {
                                                    resolve({
                                                        statusCode: 201,
                                                        success: true,
                                                        message: "success fully register"
                                                    })
                                                } else {
                                                    reject({
                                                        statusCode: 500,
                                                        success: false,
                                                        message: err
                                                    })
                                                }
                                            })
                                        } else {
                                            reject({
                                                statusCode: 400,
                                                success: false,
                                                message: "Email allredy exist"
                                            })
                                        }
                                    } else {
                                        reject({
                                            statusCode: 500,
                                            success: false,
                                            message: err
                                        })
                                    }
                                });
                            } else {
                                reject({
                                    statusCode: 400,
                                    success: false,
                                    message: "Invalid email !"
                                })
                            }
                        }
                    } else {
                        reject({
                            statusCode: 400,
                            success: false,
                            message: "User allredy exist !"
                        })
                    }
                } else {
                    reject({
                        statusCode: 500,
                        success: false,
                        message: err
                    })
                }
            });
        });


    }


    static login(username, password){
        return new Promise((resolve,reject)=>{
            let sqlQuery = `CALL verifyUser('${username}')`;
            con.query(sqlQuery, async (err, success) => {
                if(success[0].length > 0){
                    let sqlQuery = `
                    SELECT u.password AS password 
                    FROM users u
                    WHERE u.username = '${username}'`
                    con.query(sqlQuery,async (err,result)=>{
          
                        let existingPwd = result[0].password;
                        const isMatch = await bcrypt.compare(password, existingPwd);

                        if(isMatch){
                            /**create jwt token */
                            const token =    jwt.sign({
                                    userId : success[0].id,
                                    username : success[0].username
                                },process.env.SECRET_KEY,{expiresIn : "24h"})

                            resolve({
                                statusCode: 201,
                                success: true,
                                message: "success fully login",
                                token,
                                data : [
                                    {user : success[0]}
                                ]
                             
                            })
                        }else{
                            reject({
                                statusCode: 400,
                                success: false,
                                message: "Invalid password"
                            })
                        }
                    })
              

                }else{
                    reject({
                        statusCode: 400,
                        success: false,
                        message: "User not found !"
                    })
                }
            })
        })

    }

}