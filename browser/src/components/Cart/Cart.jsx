import React, { useEffect, useState } from "react";
import { Product } from "../../Pages";
import { useNavigate ,useOutletContext} from "react-router-dom";
import ModalPopup from "../ModalPopup/ModalPopup";
import api from "../../api/api";
import { itemsCountSignal } from "../../App";
const Cart = ({ cart, setCart,setItemsCount }) => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({
    message: "",
    status: "",
    hideFlag: true,
    errorFlag: true,
  });
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [timeOutId, setTimeoutId] = useState(null);
  function handleRemove(e, element) {
    // Filter out the item to remove from the cart
    const updatedCart = cart.filter(
      (item) =>
      !(
        item.product._id === element.product._id && item.size === element.size
      )
    );
    
    // Update the state with the filtered cart
    setCart(updatedCart);
    
    // Update the local storage with the updated cart
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setItemsCount(pre=>pre-1)
    itemsCountSignal.value=JSON.parse(localStorage.getItem('cart')).length
  }
  function calculateTotalPrice() {
    let totalPrice = 0;
    for (let item of cart) totalPrice = item.price + totalPrice;
    return totalPrice;
  }
  async function handleCheckout(e) {
    try {
      setLoadingFlag(true);
      const response = await api.buyProducts(cart);
      setModalState({
        message: "your bill was sent via email",
        status: 200,
        errorFlag: false,
        hideFlag: false,
      });
      itemsCountSignal.value=0
      setItemsCount(0)
      localStorage.setItem("cart",[]);
      setCart([]);
      setLoadingFlag(false);
      let id = setTimeout(() => {
        navigate("/home");
      }, 2000);
      setTimeoutId(id);
    } catch (err) {
      setModalState({
        message: err.response.data.message,
        status: err.response.status,
        errorFlag: true,
        hideFlag: false,
      });
      setLoadingFlag(false);
    } finally {
      setLoadingFlag(false);
    }
  }
  useEffect(() => {
    return () => clearTimeout(timeOutId);
  }, []);
  return (
    <>
      {modalState.hideFlag ? null : (
        <ModalPopup modalState={modalState} setModalState={setModalState} />
      )}
      <h1 className="">{cart.length}</h1>
      <article
        className="flex jusctify-center gap-10 mx-10 flex-col items-center"
        id="products in cart"
      >
        <h1 className="text-4xl">Your Shopping Cart</h1>
        <article className="w-full  px-5" id="picked items">
          {cart.map((element, index) => (
            <div
              className="border-t border-3 flex flex-row justify-between py-6"
              key={index}
            >
              <span
                className="flex justify-between items-start gap-8 "
                id="first half"
              >
                <img
                  className={`rounded-xl sm:w-[125px] w-[94px] aspect-square`}
                  alt="product image"
                  src={`${api.url}/product/get-image?productId=${element.product._id}&imageName=${element.product.imagesNames[0]}.jpg`}
                />
                <div className="flex justify-start items-start flex-col gap-5">
                  <span className="text-[gray]">
                    <h1>{element.product.name}</h1>
                    <h2>{element.product.category}</h2>
                    <h2>{element.size}</h2>
                  </span>
                  <h1 className="text-lg">Qty:{element.quantity}</h1>
                </div>
              </span>
              <span
                className="flex flex-col items-center justify-between"
                id="section 2"
              >
                ${element.price}
                <button
                  className="text-[gray] hover:text-black"
                  onClick={(e) => handleRemove(e, element)}
                  id="remove"
                >
                  remove
                </button>
              </span>
            </div>
          ))}
        </article>
        <span
          id="next step info"
          className="flex flex-row border   rounded-xl justify-between p-3 items-center w-full bg-[rgb(246,246,246)]"
        >
          <span>
            <h1 className="text-2xl">your total</h1>
            <p className="text-[rgb(92,92,92)]">
              click checkout for the next step
            </p>
          </span>
          <h1>${calculateTotalPrice()}</h1>
        </span>
        {!loadingFlag ? (
          <button
            onClick={handleCheckout}
            className=" mb-10 bg-black text-white px-10 aspect-[6/2] hover:bg-[rgb(80,80,80)]  rounded-xl"
          >
            Checkout
          </button>
        ) : (
          <h1>loading</h1>
        )}
      </article>
    </>
  );
};

export default Cart;
