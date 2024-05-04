import React,{useState,useEffect} from 'react'
import ImagesSlider from '../ImagesSlider/ImagesSlider';
import Product from './Product/Product'
const Products = ({products,modalState,setModalState}) => {
  const [fetchingRandomProductsFlag, setFetchingRandomProductsFlag] =
    useState(false);
  const [batch, setBatch] = useState(0);
  const [fetchingProductsLoaderFlag, setFetchingProductsLoaderFlag] =
    useState(false);
  return (
    <span className='w-3/4 gap-10 flex-wrap  mx-auto  flex flex-row justify-center items-center'>
      {products.length ?products.map(product=><Product key={product._id} product={product}/>): <div className="loading-state-main">
  <div className="loading-main"></div>
</div>}
    </span>
  )
}

export default Products