import React, { useEffect, useState } from "react";
import api from "../api/api";
import {signal} from '@preact/signals-react'
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ModalPopup from "../components/ModalPopup/ModalPopup";
import A1 from "../assets/images/marcus-loke-xXJ6utyoSw0-unsplash.jpg";
import A2 from "../assets/images/md-salman-tWOz2_EK5EQ-unsplash.jpg";
import A3 from "../assets/images/mediamodifier-7cERndkOyDw-unsplash.jpg";
import A4 from "../assets/images/nick-de-partee-5DLBoEX99Cs-unsplashs.jpg";
import A5 from "../assets/images/sarah-dorweiler-gUPiTDBdRe4-unsplash.jpg";
import ImagesSlider from "../components/ImagesSlider/ImagesSlider";
import { useOutletContext } from "react-router-dom";
import { itemsCountSignal } from "../App";
const Product = () => {
  const {setItemsCount}=useOutletContext()
  const navigate = useNavigate();
  const [timeOutId, setTimeoutId] = useState(null);
  const [size, setSize] = useState({ size: null, quantity: null });
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [loadingProductFlag, setLoadingProductFlag] = useState(false);
  const [modalState, setModalState] = useState({
    message: "",
    status: "",
    hideFlag: true,
    errorFlag: false,
  });
  useEffect(()=>window.scrollTo({top:0,behavior:'smooth'}),[])
  function addToCart(productId, size, price) {
    let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
    // Check if the item already exists in the cart
    const existingItemIndex = cartProducts.findIndex(
      (item) =>
        item.product._id === productId && item.size === size
    );
    for (let element of product.quantities)
      if (size === element.size) {
        if (element.quantity <= 0) {
          setModalState({
            message: "no items left",
            status: null,
            errorFlag: true,
            hideFlag: false,
          });
          return;
        }
        element.quantity = element.quantity - 1;
      }

    if (existingItemIndex !== -1) {
      // If the item already exists, increase its quantity
      cartProducts[existingItemIndex].quantity += 1;
      // Add the price to the existing price of the item
      cartProducts[existingItemIndex].price += price;
    } else {
      // If the item does not exist, add it to the cart
      cartProducts.push({
        product,
        size: size,
        quantity: 1,
        price: price,
      });
    }

    // Update local storage with the modified cartProducts array
    localStorage.setItem("cart", JSON.stringify(cartProducts));
    // Update cartItems search parameter
    setModalState({
      message: "item was added successfully",
      status: null,
      hideFlag: false,
      errorFlag: false,
    });
    setItemsCount(pre=>pre+1)
    itemsCountSignal.value=JSON.parse(localStorage.getItem('cart')).length
  }
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProductFlag(true);
        const response = await api.getProduct(productId);
        setProduct(response.data.product);
      } catch (err) {
        setLoadingProductFlag(false);
        setModalState({
          message: err.response.data.message,
          status: err.response.status,
          errorFlag: true,
          hideFlag: false,
        });
      } finally {
        setLoadingProductFlag(false);
      }
    };
    fetchProduct();
  }, [productId]);

  function handleSizeClicked(quantity, e) {
    e.preventDefault();
    e.stopPropagation();
    setSize((prev) => {
      if (prev.size == quantity.size) return { size: null, quantity: null };
      return { size: quantity.size, quantity: 1 };
    });
  }

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!size.size) return;
    addToCart(product._id, size.size, product.price);
  }
  return product?._id ? (
    <article
      id="product"
      className="relative w-[95vw] gap-5 flex flex-col sm:flex-row justify-between items-center sm:items-start  "
      aria-label="product page"
    >
      {!modalState.hideFlag ? (
        <ModalPopup modalState={modalState} setModalState={setModalState} />
      ) : null}
      <section
        aria-label="image slider"
        className="w-full sm:w-[45%] mx-auto  relative aspect-[3/2] sm:min-h-[350px] min-h-[300px] my-0"
      >
        <ImagesSlider
          imagesUrls={[
            ...product.imagesNames.map(
              (imageName) =>
                `${api.url}/product/get-image?productId=${product._id}&imageName=${imageName}.jpg`
            ),
            A1,
            A2,
            A3,
            A4,
            A5,
          ]}
        />
      </section>
      <section className="w-full gap-3 md:w-[45%]  flex flex-col justify-center  items-start" id="product-details">
        <h1 className="text-4xl">{product.name}</h1>
        <p>{product.category}</p>
        <article
          id="sizes"
          className="flex flex-row justify-start items-center flex-wrap "
          aria-label="sizes form"
        >
          {product.quantities.map((quantity, index) => (
            <button
              disabled={quantity?.quantity > 0 ? false : true}
              onClick={(e) => handleSizeClicked(quantity, e)}
              aria-label={`size ${quantity.size}`}
              className={`${quantity.size == size.size ? 'bg-black text-white' : null} p-3 my-3 ${quantity?.quantity > 0 ? 'hover:bg-[rgb(223,223,223)]' : 'cursor-not-allowed'} aspect-square border mr-4`}
              key={index}
            >
              {quantity.size}
            </button>
          ))}
        </article>
        <button onClick={handleAddToCart} className={`${!size.size ? 'cursor-not-allowed' : null} text-white px-5 aspect-[4/2] hover:bg-[rgb(130,129,129)] rounded-lg bg-[rgb(110,110,110)]`} aria-label="add to cart">
          add to cart
        </button>
        <p>{product?.description || " this is a product description I hope you liked this website a lot"}</p>
      </section>
    </article>
  ) : (
    <h1>loading</h1>
  );
};

export default Product;
