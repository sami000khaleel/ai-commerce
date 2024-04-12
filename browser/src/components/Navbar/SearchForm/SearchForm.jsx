import React,{useState} from 'react'
import SearchIcon from './SearchIcon/SearchIcon'
const SearchForm = () => {
  const [searchQuery,setSearchQuery]=useState('')
  return (
    <>
      <SearchIcon searchQuery={searchQuery}/>
    <input  type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}  className='border px-2 py-1  absolute  border-slate-300 w-full rounded-md border- border-salte-400 w-inherit  placeholder:text-[#787878]' placeholder='Search for clothes...' name={Math.random()} />
    </>
    
  )
}

export default SearchForm