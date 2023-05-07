import axios  from "axios";
import { API_BASE_URL } from "../config";
import jwt_decode from 'jwt-decode';
/**Make Api requests */
//https://docs.viator.com/partner-api/technical/#section/Access-to-endpoints

/** Authenticate function */
// export async function authenticate(username){
//     try{
//         return await axios.post(`${API_BASE_URL}/api/authenticate`,{username:username})
//     } catch (err){
//         return  {error : "Username dousn't exist...!"}
//     } 
// }

/** Get user details */
// export async function getUser(username){

//          return await axios.get(`${API_BASE_URL}/api/user/${username}`)

// }

/**Register user */
// export async function registerUser(creduntios){

//         return await axios.post(`${API_BASE_URL}/api/register`,creduntios)

// }

/**Login function */
// export async function loginUser(username,password){
//     try{
//             return await axios.post(`${API_BASE_URL}/api/register`,{username, password})
//     }catch(err){
//         return  {error : "password dousn't mach...!"}
//     }
// }
/**Update user */
// export async function updateUser(response){
//     try{
//             let token = localStorage.getItem('token')
//             return await axios.put(`${API_BASE_URL}/api/updateUser`,response,{headers :{"Authorization" : token}})
//     }catch(err){
//         return  {error : "Cant't update the user...!"}
//     }
// }

/**Generate otp */

// export async function generateOTP(username){
//     try{      
//             return await axios.get(`${API_BASE_URL}/api/generateOTP`,{params : {username}})
//     }catch(err){
//         return  {error : "Cant't generate OTP...!"}
//     }
// }


/**Verify otp */

// export async function verifyOTP(username,code){
//     try{      
//             return await  axios.get(`${API_BASE_URL}/api/verifyOTP`,{params : {username, code}})
//     }catch(err){
//         return  {error : "Cant't verify OTP...!"}
//     }
// }


/**Reset password  */
// export async function restPWD(username,password){
//     try{      
//             return await  axios.put(`${API_BASE_URL}/api/verifyOTP`,{username,password})
//     }catch(err){
//         return  {error : "Cant't reset your password...!"}
//     }
// }

// ******************************************************************
/**Api */

/** To get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}

/** authenticate function */
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

/** get User details */
export async function getUser({ username }){
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error : "Password doesn't Match...!"}
    }
}

/**get user deatails */
export async function getUserDetails(userId){
    try{
        return  await axios.get(`${API_BASE_URL}/api/userDetails`,{params : {userId :userId}});
         
    }catch(error){
        return Promise.reject({ error })
    }
}
/** register user function */
export async function registerUser(credentials){
    try {
        console.log(credentials);
        const { data :{ message , statusCode} ,status } = await axios.post(`${API_BASE_URL}/api/register`, credentials);

        // let { username, email } = credentials;

        /** send email */
        // if(status === 201){
        //     await axios.post('/api/registerMail', { username, userEmail : email, text : message})
        // }
        console.log("MM",message,status);
        return Promise.resolve(message)
    } catch (error) {
        return Promise.reject({error:"Could not Register."})
    }
}

/** login function */
export async function verifyPassword({ username, password }){
    try {
        if(username){
            const { data } = await axios.post(`${API_BASE_URL}/api/login`, { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
}

/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put(`${API_BASE_URL}/api/updateUser`, response, { headers : { "Authorization" : `${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

/** generate OTP */
export async function generateOTP(username){
    try {
        const {data : { code }, status } = await axios.get(`${API_BASE_URL}/api/generateOTP`, { params : { username }});
        
        // send mail with the OTP
        if(status === 201){
             getUser({ username }).then(async(result)=>{
                  const {data :{ data : {user :{email}}}} =await result
                  console.log(email);
                  let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
                  await axios.post(`${API_BASE_URL}/api/sendMail`, { username, text, userEmail: email,  subject : "Password Recovery OTP"})
             })
    
           
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
       const { data, status } = await axios.get(`${API_BASE_URL}/api/verifyOTP`, { params : { username, code }})
       return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put(`${API_BASE_URL}/api/resetPassword`, { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}
