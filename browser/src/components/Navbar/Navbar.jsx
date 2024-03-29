import React, { useState } from "react";
import Menu from "./Menu";
import LoginNavigator from "./LoginNavigator";
import CartNavigator from "./CartNavifator";
import DrawerMenu from "./DrawerMenu";
import TheLogo from "./TheLogo";

const Navbar = () => {
  const [drawerMenuFlage, setDrawerMenuFlage] = useState(false);
  return (
    <>
        {drawerMenuFlage ? <DrawerMenu /> : null}

    <section
      id="navbar"
      className="z-50 px-3 shadow  flex flex-row items-center justify-between h-[64px] sticky top-0 w-screen bg-[hsla(0,0%,86%,.5)]"
    >
      <TheLogo /> {/* Setting a higher z-index */}
      <article className=" hidden sm:flex items-center space-x-4">
        <LoginNavigator />
        <CartNavigator />
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
