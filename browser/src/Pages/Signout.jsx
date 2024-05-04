import React,{useEffect} from 'react'
import Cookies from 'js-cookies'
import {useNavigate} from 'react-router-dom'
const Signout = () => {
      useEffect(()=>window.scrollTo({top:0,behavior:'smooth'}),[])
  const navigate=useNavigate()
    return (
    <article className='absolute shadow-xl bg-white border-2 p-20 rounded-2xl top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>

        <button onClick={e=>{
            e.preventDefault()
            Cookies.setItem('token','')
            navigate('/home')
}}   className='p-6 bg-black text-3xl rounded-xl hover:bg-white hover:text-black hover:border-black hover:border hover:shadow-lg text-white' >signout</button>
    </article>
  )
}

export default Signout