import React, { useState } from "react";
import { effect } from "@preact/signals-react";
import { itemsCountSignal } from "../../../App";
const CartNavigator = ({itemsCount}) => {
  return (
    <span className="relative">
      <span
        id="cart items count"
        className="absolute aspect-square -bottom-3 h-5 w-5 text-sm text-center -right-4 bg-black rounded-full text-white"
      >
        {/* {JSON.stringify(localStorage.getItem('cart')).length} */}
        {itemsCountSignal.value}
      </span>
      <svg
        key={3}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="cursor-pointer relative lucide lucide-shopping-bag h-6 w-6 shrink-0"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
        <path d="M3 6h18"></path>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
    </span>
  );
};

export default CartNavigator;
