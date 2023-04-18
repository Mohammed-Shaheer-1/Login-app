const con = require("../config/db.cofig")




// exports.verifyUser = async (req,res,next)=>{
//     try{
//         const {username} = req.method == "GET" req.query :req.body
//     }catch(err){

//     }
// }

/**middleware verify the user */
exports.verifyUser=async (req,res,next)=>{

    try{

        const {username} = req.method == "GET" ? req.query :req.body
        if(!username) return res.status(501).json({
            statusCode: 501, //501 - required to fulfill the request
            success: false,
            message: "Invalid user name "
        })
    
        let query = `SELECT * FROM users u
                     WHERE u.username = '${username}'`
                     con.query(query,(err,result)=>{
                        console.log();
                        if(result.length != 0){
                            next()
                        }else{
                            res.status(400).json({
                                statusCode: 400,
                                success: false,
                                message: "Can't find user "
                            })
                        }
                     })
     
    }catch(err){
        return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "Authentication error ! "
        })
    }
}