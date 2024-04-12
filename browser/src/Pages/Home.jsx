import React, { useState, useEffect } from "react";
import ImagesSlider from "../components/ImagesSlider/ImagesSlider";
import ModalPopup from "../components/ModalPopup/ModalPopup";
import api from "../api/api";
import A1 from '../assets/images/marcus-loke-xXJ6utyoSw0-unsplash.jpg'
import A2 from '../assets/images/md-salman-tWOz2_EK5EQ-unsplash.jpg'
import A3 from '../assets/images/mediamodifier-7cERndkOyDw-unsplash.jpg'
import A4 from '../assets/images/nick-de-partee-5DLBoEX99Cs-unsplashs.jpg'
import A5 from '../assets/images/sarah-dorweiler-gUPiTDBdRe4-unsplash.jpg'
import Cookies from "js-cookies";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [modalState,setModalState]=useState({message:'',status:'',hideFlag:true,errorFlag:true})
  const [fetchingRandomProductsFlag, setFetchingRandomProductsFlag] =
    useState(false);
  const [randomProducts, setRandomProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [batch, setBatch] = useState(0);
  const [fetchingProductsLoaderFlag, setFetchingProductsLoaderFlag] =
    useState(false);
  // validate authentication
  useEffect(() => {
    if (!Cookies.getItem("token")) return navigate("/signup");
  }, []);
  // fetch products
  useEffect(() => {
    async function getRandomProducts() {
      try {
        setFetchingRandomProductsFlag(true);

        let response = await api.getRandomProducts(batch);
        console.log(response.data.products[0].imagesNames[0])
          setRandomProducts((pre) => [...pre, ...response.data.products]);
      } catch (err) {
        console.log(err)
        setModalState({message:err.response.data.message,status:err.response.status,errorFlag:true,hideModal:false})
        setFetchingProductsLoaderFlag(false);
      } finally {
        setFetchingRandomProductsFlag(false);
      }
    }
    getRandomProducts()
  }, []);
  console.log(randomProducts[0])
  return (
    <article className="relative" id="random-products">
   
      {!modalState.hideFlag?<ModalPopup modalState={modalState} setModalState={setModalState} />:null}
      {randomProducts.length ?randomProducts.map((randomProduct,i)=><div key={i} id="product">
        <section aria-label="image slider" className="max-w-[1200px] aspect-[3/2] w-full h-[250px] my-0 mx-auto">

        <ImagesSlider imagesUrls={[...randomProduct.imagesNames.map(imageName=>`${api.url}/product/get-image?productId=${randomProduct._id}&imageName=${imageName}.jpg`),A1,A2,A3,A4,A5]}/>
        </section>
      
      <span id='about' >
        <span id='text' >
        <h1>{randomProduct.name}</h1>
        <p>{randomProduct.category}</p>
        </span>
        <span id='price'>
          <p id='price' >{randomProduct.price}</p>
          <p id='previous-price' >{randomProduct.previousPrice}</p>
        </span>
      </span>
      </div>): <h1>loading</h1>}
    </article>
  );
};

export default Home;
