import React, { useEffect }  from 'react'
import { Link } from 'react-router-dom';
import avatar from '../assets/profile.png'
import {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';


import {usernameValidate} from '../helper/Validate'
import {getUser} from '../helper/helper'

import { useAuthStore } from '../store/store'

import styles from '../styles/Username.module.css'
function Username() {

  const setUsername = useAuthStore(state => state.setUsername);



const formik = useFormik({
  initialValues : {
    username : ""
  },
  validate : usernameValidate,
  validateOnBlur : true,
  validateOnChange : true,
  onSubmit : async values => {
    // console.log(values);
    setUsername(values.username);

    // getUser( "shaheer").then((result) => {
    //   console.log('Data fetched successfully',result);
    // })
    // .catch((error) => {
    //   console.log('Error fetching data:', error);
    // });
  }   
})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div >
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello Again!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit} >
              <div className='profile flex justify-center py-4'>
                  <img src={avatar} className={styles.profile_img} alt="avatar" />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username' />
                  <button className={styles.btn} type='submit'>Let's Go</button>
                  {/* <small>{formik?.values.username }</small> */}
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>Not a Member <Link className='text-red-500' to="/register">Register Now</Link></span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Username