import axios  from "axios";
import { API_BASE_URL } from "../config";
/**Make Api requests */
//https://docs.viator.com/partner-api/technical/#section/Access-to-endpoints

/** Authenticate function */
export async function authenticate(username){
    try{
        return await axios.post(`${API_BASE_URL}/api/authenticate`,{username:username})
    } catch (err){
        return  {error : "Username dousn't exist...!"}
    } 
}

/** Get user details */
export async function getUser(username){

         return await axios.get(`${API_BASE_URL}/api/user/${username}`)

}

/**Register user */
export async function registerUser(creduntios){
    try{
        return await axios.post(`${API_BASE_URL}/api/register`,creduntios)
    }catch(err){
        return Promise.rejuct({err})
    }
}

/**Login function */
export async function loginUser(username,password){
    try{
            return await axios.post(`${API_BASE_URL}/api/register`,{username, password})
    }catch(err){
        return  {error : "password dousn't mach...!"}
    }
}
/**Update user */
export async function updateUser(response){
    try{
            let token = localStorage.getItem('token')
            return await axios.put(`${API_BASE_URL}/api/updateUser`,response,{headers :{"Authorization" : token}})
    }catch(err){
        return  {error : "Cant't update the user...!"}
    }
}

/**Generate otp */

export async function generateOTP(username){
    try{      
            return await axios.get(`${API_BASE_URL}/api/generateOTP`,{params : {username}})
    }catch(err){
        return  {error : "Cant't generate OTP...!"}
    }
}


/**Verify otp */

export async function verifyOTP(username,code){
    try{      
            return await  axios.get(`${API_BASE_URL}/api/verifyOTP`,{params : {username, code}})
    }catch(err){
        return  {error : "Cant't verify OTP...!"}
    }
}


/**Reset password  */
export async function restPWD(username,password){
    try{      
            return await  axios.put(`${API_BASE_URL}/api/verifyOTP`,{username,password})
    }catch(err){
        return  {error : "Cant't reset your password...!"}
    }
}
