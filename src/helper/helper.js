import axios  from "axios";

/**Make Api requests */

/** Authenticate function */
export async function authenticate(username){
    try{
        return await axios.post('/api/authenticate',{username:username})
    } catch (err){
        return  {error : "Username dousn't exist...!"}
    } 
}

/** Get user details */
export async function getUser(username){
    try{
         return await axios.get('/api/user/'+username)
    } catch (err){
        return  {error : "password dousn't mach...!"}
    }
}

/**Register user */
export async function registerUser(creduntios){
    try{
        return await axios.post('/api/register',creduntios)
    }catch(err){
        return Promise.rejuct({err})
    }
}

/**Login function */
export async function loginUser(username,password){
    try{
            return await axios.post('/api/register',{username, password})
    }catch(err){
        return  {error : "password dousn't mach...!"}
    }
}
/**Update user */
export async function updateUser(response){
    try{
            let token = localStorage.getItem('token')
            return await axios.put('/api/updateUser',response,{headers :{"Authorization" : token}})
    }catch(err){
        return  {error : "Cant't update the user...!"}
    }
}

/**Generate otp */

export async function generateOTP(username){
    try{      
            return await axios.get('/api/generateOTP',{params : {username}})
    }catch(err){
        return  {error : "Cant't generate OTP...!"}
    }
}


/**Verify otp */

export async function verifyOTP(username,code){
    try{      
            return await  axios.get('/api/verifyOTP',{params : {username, code}})
    }catch(err){
        return  {error : "Cant't verify OTP...!"}
    }
}


/**Reset password  */
export async function restPWD(username,password){
    try{      
            return await  axios.put('/api/verifyOTP',{username,password})
    }catch(err){
        return  {error : "Cant't reset your password...!"}
    }
}
