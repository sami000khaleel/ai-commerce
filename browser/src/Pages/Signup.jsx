import React,{useEffect, useState} from 'react'
import TextInput from '../components/From/TextInput/TextInput'
import Submit from '../components/From/Submit/Submit'
import { Link,useNavigate } from 'react-router-dom'
import api from '../api/api'
import ModalPopup from '../components/ModalPopup/ModalPopup'
import { ArrowLeft,ArrowRight } from 'lucide-react'
import Cookies from 'js-cookies'
import SelectInput from '../components/From/SelectInput/SelectInput'
const Signup = () => {
  const navigate=useNavigate()
  const [step,setStep]=useState(1)
  const [countries,setCountries]=useState([])
  const [cities,setCities]=useState([])
  const [location,setLocation]=useState({country:'',city:'',address:''})
  const [loadingCountriesFlage,setLoadingCountriesFlag]=useState(true)
  const [modalState,setModalState]=useState({message:'',status:'',hideFlag:true,errorFlag:true})
  const [userData,setUserData]=useState({
    name:'',
    password:'',
    email:'',

  })
  useEffect(()=>window.scrollTo({top:0,behavior:'smooth'}),[])

  const [loadingFlag,setLoadingFlag]=useState(false)
  useEffect(()=>{
  async  function getCountries(){
    try {
      
      const response=await api.getCountries()
      setCountries(response.data.countries)

    } catch (error) {
      setModalState({message:error.response.data.message,status:error.response.status,errorFlag:true,hideFlag:false})
    }
  }
  if(Cookies.getItem('token'))
    return navigate('/home')
  getCountries()
  },[])
  useEffect(()=>{
  async  function getCities(){
    try {
      
      const response=await api.getCities(location.country)
      setCities(response.data.cities)
      console.log('das')
    } catch (error) {
      console.log(error.response.data)
      setModalState({message:error.response.data.message,status:error.response.status,errorFlag:true,hideFlag:false})
    }
  }
  if(location.country)
      getCities()
  },[location.country])
  async function handleSignup(userData,location){
try {
  if(!userData?.name||!userData?.email||!userData?.password||!location?.address||!location?.country||!location?.city)
    return setModalState({message:'you need to fill out the whole form',status:null,errorFlag:true,hideFlag:false})
  setLoadingFlag(true)
  userData.location=location
  const response=await api.createAccount(userData)
  console.log(Object.keys(response.headers))
  Cookies.setItem('token',response.headers.token)
  setLoadingFlag(false)
  navigate('/home')

} catch (error) {
  console.log(error)
  setModalState({message:error.response.data.message,status:error.response.status,errorFlag:true,hideFlag:false})
  setLoadingFlag(false)

}  finally{
setLoadingFlag(false)
}
  }
  console.log(userData,location)
  return (
    <span className='px-3'>
{!modalState.hideFlag?<ModalPopup modalState={modalState} setModalState={setModalState}/>:null}

    <form id='signup form ' className=' card shadow-xl border relative rounded-xl p-6 flex flex-col justify-center items-start gap-6'>
             <h1 className=' text-3xl' > signup</h1>
{step==1?<>
 <TextInput value={userData.name} name='name'  type='text' setUserData={setUserData}/>
        <TextInput value={userData.email} name='email' type='email' setUserData={setUserData}/>
        <TextInput value={userData.password} name='password' type='password' setUserData={setUserData}/>
        <button id='next step' className='absolute text-5xl  top-1/2 -translate-y-1/2 right-0 translate-x-1/2' onClick={e=>{e.preventDefault()
        setStep(2)
        }} ><ArrowRight/></button>
</>:null}
       { step==2?<>
        <SelectInput value={location.country} name='country' setLocation={setLocation} options={countries}/>
{        location.country?<SelectInput  value={location.city} name='city' options={cities} setLocation={setLocation} />
:<h1 className='block border relative p-3 w-full max-w-[205px] bg-[white]' >choose a country</h1>
}        <TextInput value={location.address} name='address' type='text' setUserData={setLocation} />
        {loadingFlag?<h1 className='bg-black text-white rounded-lg p-3'>laoding</h1>:<Submit location={location} setModalState={setModalState} loginFlage={false} signupFlag={true} handleLogin={null} handleSignup={handleSignup} userData={userData} />}
        <button id='next step' className='absolute text-5xl  top-1/2 -translate-y-1/2 left-0 -translate-x-1/2' onClick={e=>{e.preventDefault()
        setStep(1)
        }} >
          <ArrowLeft/>
        </button>
        </>:null}
    
      </form>
      <h1 className='mt-5 flex justify-center gap-2 items-center flex-wrap' > don`t you have an account yet? <Link to='/login' className='bg-black text-white p-2 rounded-md' >login</Link> </h1>

    </span>
  )
}

export default Signup