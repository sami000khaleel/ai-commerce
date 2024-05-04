import React, { useContext, useEffect, useState } from "react";
import { useNavigate,useOutletContext } from "react-router-dom";
import Cart from "../components/Cart/Cart";
const CartPage = () => {
  const {setItemsCount}=useOutletContext()
  const navigate = useNavigate();
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart"))
  );
  useEffect(()=>window.scrollTo({top:0,behavior:'smooth'}),[])

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  return (
    <section id="cart" className="w-full overflow-visible ">

      {cart?.length ? (
        <Cart setItemsCount={setItemsCount} cart={cart} setCart={setCart} />
      ) : (
        <article className="flex flex-col justify-center gap-12 items-start pl-10" id="empty cart">
          <h1 className="text-4xl text" >Your Shopping Cart is empty</h1>
          <p>Looks like you haven’t added any items to the cart yet.</p>
          <button
          className="bg-black hover:bg-[rgb(33,33,33)] text-white text-lg py-4 rounded-lg px-7"
            onClick={(e) => {
              e.preventDefault();
              navigate("/home");
            }}
          >
            explore products
          </button>
        </article>
      )}
    </section>
  );
};

export default CartPage;
