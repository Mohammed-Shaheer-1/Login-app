import toast from 'react-hot-toast'


/** Validate login page username */
export async function usernameValidate(values){
    const error = userNameVerify({}, values)

    // if(values.username){
    //     // check user exist or not
    //     const { status } = await authenticate(values.username);
        
    //     if(status !== 200){
    //         errors.exist = toast.error('User does not exist...!')
    //     }
    // }

    return error;

}

/** validate password */
export async function passwordValidate(value){
    const error = passwordVerify({},value)
    return error 
}
/**validate reset password */
export async function resetPasswordValidation(value){
    const error = passwordVerify({},value)

    if(value.password !== value.confirm_pwd){
        error.exist = toast.error("Password not match...!")
    }

    return error

}

/** Validate register form  */
export async function registerValidation(values){
    const errors = userNameVerify({}, values)
    passwordVerify(errors,values )
    emailVerify(errors, values);

    return errors;
}

/** validate profile page */
export async function profileValidation(values){
    const errors = emailVerify({}, values);
    return errors;
}

/** ************************************************* */

/** validate password */
const passwordVerify=(errors = {}, values)=>{
    /* eslint-disable no-useless-escape */
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    } else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters long");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special character");
    }

    return errors;
}

/** Validate user name */
const userNameVerify=(error = {},values )=>{
    console.log(error, "error")
    if(!values.username){
         error.username = toast.error("Username Required")
    }else if(values.username.includes(" ")){
        error.username = toast.error("Invalid username")
    }
  return error
}

/** validate email */
function emailVerify(error ={}, values){
    if(!values.email){
        error.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        error.email = toast.error("Wrong Email...!")
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Invalid email address...!")
    }

    return error;
}