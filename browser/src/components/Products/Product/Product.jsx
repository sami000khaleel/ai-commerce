import React from 'react'
import ModalPopup from '../../ModalPopup/ModalPopup';
import api from '../../../api/api'; 
import A1 from '../../../assets/images/marcus-loke-xXJ6utyoSw0-unsplash.jpg'
import A2 from '../../../assets/images/md-salman-tWOz2_EK5EQ-unsplash.jpg'
import A3 from '../../../assets/images/mediamodifier-7cERndkOyDw-unsplash.jpg'
import A4 from '../../../assets/images/nick-de-partee-5DLBoEX99Cs-unsplashs.jpg'
import A5 from '../../../assets/images/sarah-dorweiler-gUPiTDBdRe4-unsplash.jpg'
import Cookies from "js-cookies";
import { useNavigate } from "react-router-dom";
import ImagesSlider from '../../ImagesSlider/ImagesSlider';
const Product= ({product}) => {
  const navigate=useNavigate()
  const handleProductClicked=(e)=>{
    e.stopPropagation()
    e.preventDefault()
    navigate(`/product/${product._id}`)
  }
  return (
<div
  onClick={handleProductClicked}
className=' z-30 cursor-pointer w-auto   sm:max-w-[400px]   shadow-xl p-2 px-4 border' id="product">
        <section aria-label="image slider" className="sm:max-w-[1200px]  flex  aspect-[3/2]  max-w-[240px] min-h-[250px] my-0 shadow-lg bg-white border  mx-auto">

        <ImagesSlider imagesUrls={[...product.imagesNames.map(imageName=>`${api.url}/product/get-image?productId=${product._id}&imageName=${imageName}.jpg`),A1,A2,A3,A4,A5]}/>
        </section>
      
      <span  className='flex justify-between w-full  items-start' id='about' >
        <span className='flex flex-col justify-between' id='text' >
        <h1 className='text-black text-2xl'>very nice {product.name}</h1>
        <p className='text-[#999]'>{product.category}</p>
        </span>
        <span className='pt-2 relative' id='price'>
      {
      product.previousPriceprice
      ?<p 
        aria-label='previous-price'
          style={{color:!product?.previousPriceprice?'rgba(0,0,0,0.4)':'black'}}
          className='absolute top-full text-center m-auto p-auto' id='price' >{product.previosuPricePrice||20}
          <span className='absolute w-[130%] h-[1px] top-1/2 translate-y-1/2 left-1/2  -translate-x-1/2 rotate-[-6rad] bg-[rgba(0,0,0,0.4)]'> </span>
          $</p>:null}
          <p aria-label='current price' id='current-price' >{product.price}$</p>
        </span>
      </span>
      </div>  )
}

export default Product