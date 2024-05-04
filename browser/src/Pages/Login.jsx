import React,{useState,useEffect} from 'react'
import TextInput from '../components/From/TextInput/TextInput'
import Submit from '../components/From/Submit/Submit'
import {Link} from 'react-router-dom'
import api from '../api/api'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookies'
import ModalPopup from '../components/ModalPopup/ModalPopup'
const Login = () => {
  const navigate=useNavigate()
  const [modalState,setModalState]=useState({message:'',status:'',hideFlag:true,errorFlag:true})
  const [userData,setUserData]=useState({email:'',password:''})
  const [loadingFlag,setLoadingFlag]=useState(false)
  useEffect(()=>{
    if(Cookies.getItem('token'))
      return navigate('/home')
  },[])
  const handleLogin=async()=>{
    if(!userData?.email||!userData?.password)
      return setModalState({message:'enter you`r email and password please',status:null,errorFlag:true,hideFlag:false})
    try{
      setLoadingFlag(true)
      const response=await api.login(userData.email,userData.password)
      localStorage.setItem('user',JSON.stringify(response.data.user))
      Cookies.setItem('token',response.headers.token)
      navigate('/home')
    }catch(err){
        setModalState({message:err.response.data.message,status:err.response.status,errorFlag:true,hideFlag:false})
        setLoadingFlag(false)
    }finally{
      setLoadingFlag(false)
    }
  }

  return (
    <span>
{!modalState.hideFlag?<ModalPopup modalState={modalState} setModalState={setModalState}/>:null}
    <form id='signup form ' className='card shadow-xl border rounded-xl p-6 flex flex-col justify-center items-start gap-6'>
     <h1 className=' text-3xl' > login</h1> 
     <TextInput type='email' name='email' setUserData={setUserData} />
     <TextInput type='password' name='password' setUserData={setUserData} />
    <span className='flex flex-col justify-start items-start flex-wrap gap-3'>

{loadingFlag?<h1 className='bg-black text-white rounded-lg p-3'>laoding</h1>:<Submit setModalState={setModalState} signupFlag={false} handleLogin={handleLogin} userData={userData} loginFlag={true}/>}    <h1 className='text-[rgb(145,145,145)]' >forgot your password? <Link to='/recover-account' className='p-2 rounded-lg text-black text-lg ' >restore the account</Link></h1>
    </span>
      </form>
      <h1 className='mt-5' >already have an account? <Link to='/signup' className='bg-black text-white p-2 rounded-md' >signup</Link> </h1>
    </span>
    )
}

export default Login