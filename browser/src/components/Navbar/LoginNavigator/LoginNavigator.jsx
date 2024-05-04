import React from 'react'
import {useNavigate} from 'react-router-dom'
const LoginNavigator = () => {
  const navigate=useNavigate()
  return (
    <svg 
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="cursor-pointer lucide lucide-user h-6 w-6 shrink-0"
    aria-hidden="true"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>  )
}

export default LoginNavigator