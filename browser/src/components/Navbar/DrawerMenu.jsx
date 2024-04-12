import React from "react";
import SearchForm from "./SearchForm/SearchForm";
import LoginNavigator from './LoginNavigator'
import CartNavigator from './CartNavigator'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookies'
import { Link } from "react-router-dom";
const DrawerMenu = () => {
  const navigate=useNavigate()
  return (
    <span className="w-screen block sm:hidden z-50 h-auto  absolute top-0 right-0 bg-white">
      <ul className="flex shadow-xl px-4 w-screen bg-white  justify-start  flex-col items-start pt-20 absolute left-1/2 -translate-x-1/2 top-0   ">
        <li  className="py-5    w-full flex relative justify-center border-black items-center ">
        {/* <h1>search form</h1> */}
          <SearchForm />
        </li>
        <li  className="py-5 mt-4  border-t  w-full flex justify-start border-black items-center ">
        <span onClick={()=>{
          Cookies.getItem('token')?navigate('/signout'):navigate('/signup')
        }} >
        <LoginNavigator />
        </span>
        </li>
        <li className="py-5 border-t z-50  w-full flex justify-start items-center border-black " >
          <Link to='cart'>
          <CartNavigator/>
          </Link>
        </li>
      </ul>
    </span>
  );
};

export default DrawerMenu;
