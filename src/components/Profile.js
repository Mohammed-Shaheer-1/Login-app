import React, { useEffect, useState } from 'react'
import avatar from '../assets/profile.png';
import toast,{ Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/Validate';
import convertToBase64 from '../helper/convert';
import { useNavigate } from 'react-router-dom';
// import { updateUser } from '../helper/helper'
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper'
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css'
import { useAuthStore } from '../store/store';
import { getUserDetails } from '../helper/helper';
function Profile() {
  
  const { username,userId } = useAuthStore(state => state.auth);
  const [ profileData,setProfile ] = useState([])
  const [ verify , setverify ] =  useState(false)
  const [file, setFile] = useState();
  const [ img,setImg ] = useState('');
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);
  const navigate = useNavigate()

  useEffect(()=>{
  
   
   getUserDetails(userId).then((result)=>{
    console.log("HH",result.data.data[0].result);
    setProfile(result.data.data[0].result)
    if(!result.data.data[0]){
      setverify(true)
    }
    console.log("Profile",profileData.profile);
    setImg(profileData.profile)
   })



  },[])

  const formik = useFormik({
    initialValues : {
      firstName : profileData.first_name ,
      lastName:  profileData.last_name,
      email: profileData.email,
      mobile:  profileData.mobile,
      address : profileData.address
    },
    enableReinitialize: true,
    validate : profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || apiData?.profile || ''})
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success : <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });

    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    console.log(base64);
    setFile(base64);
  }
  // logout handler function
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>


  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div style={{ width: "45%", paddingTop: '3em'}}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Profile</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                You can update the details.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}> 
              <div className='profile flex justify-center py-4'>
                  <label htmlFor="profile">

                    <img src={file || img || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" />
                  </label>
                  
                  <input onChange={onUpload} type="file" id='profile' name='profile' />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} type="text"  placeholder='FirstName' />
                  <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='LastName' />
                </div>

                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Mobile No.' />
                  <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Email*' />
                </div>

               
                  <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Address' />
                  <button className={styles.btn} type='submit'>{!verify ?  'Update' : 'Add'}</button>
               
                  
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>come back later? <button  className='text-red-500' onClick={userLogout} to="/">Logout</button></span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Profile