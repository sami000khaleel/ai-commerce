import React, { useState } from "react";
import Cookies from 'js-cookies'
import Menu from "./Menu";
import {Link,useNavigate} from 'react-router-dom'
import LoginNavigator from "./LoginNavigator";
import CartNavigator from "./CartNavigator";
import DrawerMenu from "./DrawerMenu";
import TheLogo from "./TheLogo";
import SearchForm from "./SearchForm/SearchForm";

const Navbar = () => {
  const navigate=useNavigate()
  const [drawerMenuFlage, setDrawerMenuFlage] = useState(false);
  return (
    <>
        {drawerMenuFlage ? <DrawerMenu /> : null}

    <section
      id="navbar"
      className="shadow-xl z-50 md:px-[3rem] px-3 flex flex-row items-center justify-between h-[64px] sticky top-0 w-screen bg-[hsla(0,0%,86%,.5)]"
    >
      <Link className="" to='/'>
      <TheLogo /> {/* Setting a higher z-index */}
      </Link>
      <article className=" hidden max-w-[266px] w-1/2 relative flex-row sm:flex justify-between items-center ">
        <span className="relative hidden w-[200px] sm:flex justify-center items-center">
          
        <SearchForm/>
        </span>
        <span onClick={()=>{
          Cookies.getItem('token')?navigate('/signout'):navigate('/signup')
        }} >
        <LoginNavigator />
        </span>
        <Link to='/cart'>
        <CartNavigator />
        </Link>
      </article>
      <span className="block sm:hidden">
        <Menu
          drawerMenuFlage={drawerMenuFlage}
          setDrawerMenuFlage={setDrawerMenuFlage}
        />
      </span>
    </section>
      </>
  );
};

export default Navbar;
