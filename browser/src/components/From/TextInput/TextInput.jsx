import React from 'react'

const TextInput = ({value,name,type,setUserData}) => {
   function  handleChange(e)
     {
        e.preventDefault()
        setUserData(pre=>{return{... pre,[e.target.name]:e.target.value}})
    }
    return (
    <>
    <input value={value} className='border relative p-3   bg-[hsla(0,0%,97%,1)]' onChange={handleChange} type={type} name={name} id={name} placeholder={`enter your ${name}`} /></>
  )
}

export default TextInput