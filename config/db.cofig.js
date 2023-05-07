                    /////////////////////////////////////////////////////////////////////////////////
                    //                                                                             //
                    //                              DATABASE CONNECTION                            //
                    //                                                                             //
                    /////////////////////////////////////////////////////////////////////////////////

const mysql = require('mysql');

require('dotenv').config();

       /** create connection */
        var  con =mysql.createConnection
        ({ 
            host : process.env.USER_HOST, // hostname
            user : process.env.USER_ROOT, // username
            password : process.env.DBPASSWORD, // password
            database : process.env.DB_NAME // database name
        });
        con.connect(function async (err) 
        {
            if (err) 
            {
                console.log(" ### Error While connecting with the database ###", err.message);
            }
            else
            {
                console.log("DB Connected !");
            }
        });
   
module.exports = con;
