import React from 'react';

const Menu = ({drawerMenuFlag,setDrawerMenuFlag}) => {
  function handleMenuClicked(e){
    e.preventDefault()
    setDrawerMenuFlag((pre)=>!pre)
 }
  return (
    !drawerMenuFlag?
    <button  className='z-50 relative mr-4 '    onClick={handleMenuClicked}
    >

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
      className="z-50 cursor-pointer lucide lucide-menu h-6 w-6 shrink-0"
      aria-hidden="true"
      >
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
      </button>
    :
    <button className='z-50 relative mr-4' onClick={handleMenuClicked} >
    <svg className="z-50  lucide lucide-x h-6 w-6 shrink-0 cursor-pointer " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
    </button>
  );
};

export default Menu;
