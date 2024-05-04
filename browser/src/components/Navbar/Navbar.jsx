import React, { useState, useEffect } from "react";
import Cookies from 'js-cookies'
import Menu from "./Menu/Menu";
import { Signal, signal } from "@preact/signals-react";
import { Link, useNavigate,useSearchParams ,useLocation} from 'react-router-dom'
import LoginNavigator from "./LoginNavigator/LoginNavigator";
import CartNavigator from "./CartNavigator/CartNavigator";
import DrawerMenu from "./DrawerMenu/DrawerMenu";
import TheLogo from "./TheLogo/TheLogo";
import SearchForm from "./SearchForm/SearchForm";
const Navbar = ({setProducts,setModalState,modalState}) => {
  const location = useLocation();

  const navigate = useNavigate()
  const [drawerMenuFlag, setDrawerMenuFlag] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

 
  useEffect(() => {
    // This effect will run whenever the URL changes
    // You can perform any actions you want here
  }, [location.pathname]); // Add location.pathname to the dependency array

  return (
    <>

      {drawerMenuFlag ? <DrawerMenu setProducts={setProducts} setDrawerMenuFlag={setDrawerMenuFlag} setModalState={setModalState} /> : null}

      <section
        id="navbar"
        className="shadow-xl px-2 sm:px-7 fixed z-50 md:px-[3rem]  flex flex-row items-center justify-between h-[64px]  top-0 w-screen bg-[#eeeeee]"
      >
           
        <a href='/home'>
          <TheLogo /> {/* Setting a higher z-index */}
        </a>
        <article className="hidden  max-w-[266px] w-1/2 relative flex-row sm:flex justify-between items-center ">
          <span className="relative hidden w-[200px] sm:flex justify-center items-center">
          <SearchForm setProducts={setProducts} setDrawerMenuFlag={setDrawerMenuFlag} setModalState={setModalState} />
          </span>
          <span onClick={() => {
            Cookies.getItem('token') ? navigate('/signout') : navigate('/signup')
          }} >
            <LoginNavigator />
          </span>
          <Link className="mx-3" to='/cart'>
            <CartNavigator itemCount={cartItemCount} />
          </Link>
        </article>
        <span className="block sm:hidden">
          <Menu
            drawerMenuFlag={drawerMenuFlag}
            setDrawerMenuFlag={setDrawerMenuFlag}
          />
        </span>
      </section>
    </>
  );
};

export default Navbar;
