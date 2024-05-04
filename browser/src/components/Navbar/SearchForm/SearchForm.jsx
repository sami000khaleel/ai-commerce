import React,{useState} from 'react'
import SearchIcon from './SearchIcon/SearchIcon'
import api from '../../../api/api'
import {useOutletContext, useNavigate } from 'react-router-dom'
import FilterForm from '../../From/FilterForm/FilterForm'
import ModalPopup from '../../ModalPopup/ModalPopup'
const SearchForm = ({setProducts,setModalState,setDrawerMenuFlag}) => {
  const navigate=useNavigate()
  const [searchQuery,setSearchQuery]=useState('')
  const [loadingFlag,setLoadingFlag]=useState(false)
  const [filterFlag,setFilterFlag]=useState(false)
  const [filterQuery,setFilterQuery]=useState({price:{max:'',min:''},category:''})
  async function handleSearch(e){
    e.preventDefault()
    e.stopPropagation()
    try{
      setLoadingFlag(true)
      const response=await api.getProducts(searchQuery,filterQuery.category,filterQuery.price.max,filterQuery.price.min)
      setProducts(response.data.products)
      setLoadingFlag(false)
      setFilterFlag(false)
      setDrawerMenuFlag(false)
      setModalState({message:'products were fetched succefully',status:200,errorFlag:false,hideFlag:false})
      navigate('/home')

    }catch(err){
      setLoadingFlag(false)
      console.log(err)
      setModalState({message:err.response?.data?.message||'error while fetching the products',status:err.response.status,errorFlag:true,hideFlag:false})
    }
  }  return (
    <span className='pr-2 relative'>

      <button onClick={()=>setFilterFlag(pre=>!pre)} className='absolute top-full text-white bg-black p-1  rounded-lg' >filter</button>
      {filterFlag?<FilterForm  setFilterFlag={setFilterFlag} filterQuery={filterQuery} setFilterQuery={setFilterQuery}  />:false}
      {!loadingFlag?<SearchIcon handleSearch={handleSearch} />:<div className="loading-state">
  <div className="loading"></div>
</div>}
    <input  type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}  className=' border px-2 py-1    border-slate-300 w-full rounded-md border- border-salte-400 w-inherit  placeholder:text-[#787878]' placeholder='Search for clothes...' name={Math.random()} />
    </span>
    
  )
}

export default SearchForm