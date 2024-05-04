import React, { useState, useEffect } from "react";
import ImagesSlider from "../components/ImagesSlider/ImagesSlider";
import ModalPopup from "../components/ModalPopup/ModalPopup";
import api from "../api/api";
import A1 from "../assets/images/marcus-loke-xXJ6utyoSw0-unsplash.jpg";
import A2 from "../assets/images/md-salman-tWOz2_EK5EQ-unsplash.jpg";
import A3 from "../assets/images/mediamodifier-7cERndkOyDw-unsplash.jpg";
import A4 from "../assets/images/nick-de-partee-5DLBoEX99Cs-unsplashs.jpg";
import A5 from "../assets/images/sarah-dorweiler-gUPiTDBdRe4-unsplash.jpg";
import Cookies from "js-cookies";
import { useNavigate, useOutletContext } from "react-router-dom";
import Products from "../components/Products/Products";

const Home = () => {
  const { products, setProducts, modalState, setModalState } =
    useOutletContext();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(1);
  const [fetchingProductsFlag, setFetchingProductsFlag] = useState(false);
  const [fetchingProductsLoaderFlag, setFetchingProductsLoaderFlag] =
    useState(false);
  async function getProducts() {
    try {
      setFetchingProductsFlag(true);
      let response = await api.getRandomProducts(batch);
      setProducts(response.data.products);
    } catch (err) {
      console.log(err);
      setModalState({
        message: err.response.data.message,
        status: err.response.status,
        errorFlag: true,
        hideModal: false,
      });
      setFetchingProductsLoaderFlag(false);
    } finally {
      setFetchingProductsFlag(false);
    }
  }
  useEffect(()=>window.scrollTo({top:0,behavior:'smooth'}),[])

  // validate authentication
  useEffect(() => {
    if (!Cookies.getItem("token")) return navigate("/signup");
  }, []);
  // fetch products
  useEffect(() => {
    if(Cookies.getItem('token'))
    getProducts();
  }, [batch]);
  useEffect(() => {
    if(Cookies.getItem('token'))
    getProducts();
  }, []);
  return (
    <article className="relative my-10" id="-products">
      <Products
        products={products}
        modalState={modalState}
        setModalState={setModalState}
      />
     { products.length&&products.length===10?<span className="flex flex-row justify-evenly mt-8 items-center">
        {batch > 1 ? (
          <button
            onClick={(e) => {
              window.scrollTo({ top: 0, behavior: "smooth" });

              setBatch((pre) => pre - 1);
            }}
            className="text-xl bg-black text-white rounded-xl p-3"
          >
            previous page
          </button>
        ) : null}
        <button
          onClick={(e) => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setBatch((pre) => pre + 1);
          }}
          className="text-xl bg-black text-white rounded-xl p-3"
        >
          next page
        </button>
      </span>:null}
    </article>
  );
};

export default Home;
