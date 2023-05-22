const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const con = require('../config/db.cofig')
const helper = require('../helper/helper')
const mailer = require('../controller/mailer');
const { query } = require('express');

module.exports = class user {
    constructor() { }
    /**user registration */
    static addUser(username, password, profile, email) {
        return new Promise((resolve, reject) => {

            //check the existing user
            let sql = `SELECT * FROM users u WHERE u.username = '${username}'`;
            let sqlQuery = `CALL verifyUser('${username}')`;
            let verifyUser = con.query(sqlQuery, async (err, success) => {
                if (!err) {
                    console.log(success[0][0]);
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

    /**user login */
    static login(username, password){
        return new Promise((resolve,reject)=>{

            let sqlQuery = `CALL verifyUser('${username}')`;
            con.query(sqlQuery, async (err, success) => {

               
                if(success[0].length > 0){ 
                    let userId = success[0][0].id
                    let sqlQuery = `
                    SELECT u.password AS password , u.id userId
                    FROM users u
                    WHERE u.username = '${username}'`
                    con.query(sqlQuery,async (err,result)=>{
  
                        let existingPwd = result[0].password; 
                        const isMatch = await bcrypt.compare(password, existingPwd); 

                        if(isMatch){
                            /**create jwt token */
                   
                            const token =    jwt.sign({
                                    userId : success[0][0].id, 
                                    username : success[0][0].username
                                },process.env.SECRET_KEY,{expiresIn : "24h"})
                         
                        //   let genMail = await   mailer.SendGeneratedOTPCode('shanshaheer3@gmail.com','123456')
                        //   console.log("ff",genMail);
                        
                        let updateCount =  `UPDATE login_attempts lg
                                            SET lg.attempt_count = NULL, lg.blocked_at = NULL, lg.blocked_until = NULL
                                            WHERE lg.userId = ${userId}`
                        con.query(updateCount, async (err,result)=>{
                                if(!err){
                                    resolve({
                                        statusCode: 201,
                                        success: true,
                                        message: "success fully login",  
                                        token,
                                        data : [
                                            {user : success[0]}
                                        ]
                                     
                                    })
                                }
                        })                    
          
                        }else{
                            let query = `
                                            SELECT *
                                            FROM login_attempts lg
                                            WHERE lg.userId = ${userId}`
                           con.query(query,async(err,result)=>{
                                if(!err){
                                
                                    if(result.length != 0){
                                            let getLoginattempt = `SELECT lg.attempt_count
                                            FROM login_attempts lg
                                            WHERE lg.userId = ${userId} AND lg.attempt_count IS NOT NULL`;

                                          con.query(getLoginattempt,async(err,res)=>{
                                                  console.log(res);
                                                  if(res.length != 0){
                                                    let count = await res[0].attempt_count +1
                                                    console.log("count",count);
                                                    let maximem_attempt = 3
                                                    if(count<=maximem_attempt){
                                                      console.log("yss");
                                                          let query = `UPDATE login_attempts lg
                                                          SET lg.attempt_count = lg.attempt_count + 1
                                                          WHERE lg.userId = ${userId} AND lg.attempt_count IS NOT NULL`;
                                                          con.query(query,(err,result)=>{
                                                              if(!err){  
                                                                  reject({
                                                                      statusCode: 400 ,
                                                                      success: false,
                                                                      message: "Invalid password"
                                                                  })
                                                              }
                                                          })
                                                    }else{ 
                                                        let query = `UPDATE login_attempts AS lg
                                                        SET lg.blocked_at = STR_TO_DATE(DATE_FORMAT(NOW(), '%d/%m/%Y %H:%i:%s'), '%d/%m/%Y %H:%i:%s'),
                                                        lg.blocked_until = STR_TO_DATE(DATE_FORMAT(NOW() + INTERVAL 1 MINUTE, '%d/%m/%Y %H:%i:%s'), '%d/%m/%Y %H:%i:%s')
                                                        WHERE lg.userId = ${userId};
                                                         `;
                                                    con.query(query,async(err,result)=>{
                                                        if(!err){

                                                            let query = `ALTER EVENT reset_login_attempts ENABLE`
                                                            con.query(query,async (err,result)=>{
                                                                console.log(err);
                                                                if(!err){
                                                                    reject({ 
                                                                        statusCode: 400 ,
                                                                        success: false,
                                                                        message: "Try after 1 minute"
                                                                    })
                                                                } 

                                                            }) 
                                                       
                                                        }
                                                    })
  
                                                    
                                                    }
                                                    }else{
                                                        let query = `UPDATE login_attempts lg
                                                                     SET lg.attempt_count = 1
                                                                     WHERE lg.userId = ${userId}`
                                                        con.query(query,async (err,result)=>{
                                                                    if(!err){
                                                                        reject({
                                                                            statusCode: 400 ,
                                                                            success: false, 
                                                                            message: "Invalid password"
                                                                        })
                                                                    }
                                                        })             
                                                    }
                                               

                                          })   

                                           
                                         
                                    }else{
                                        let query = `INSERT INTO login_attempts (userId, attempt_count)
                                                     VALUES (${userId}, ${1});`
                                            con.query(query,async(error,res)=>{
                                              
                                                if(!error){
                                                    reject({
                                                        statusCode: 400 ,
                                                        success: false, 
                                                        message: "Invalid password"
                                                    })
                                                }
                                            })

                                    }
                            
                                }
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