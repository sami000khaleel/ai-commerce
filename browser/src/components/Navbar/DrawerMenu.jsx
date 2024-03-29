import React from 'react'
import SearchForm from './SearchForm/SearchForm'

const DrawerMenu = () => {
  return (
    <ul className='flex w-6/8  justify-center pl-3 items-start pt-20 absolute left-0  top-0 bg-white w-screen h-[100vh]'>
        <SearchForm/>
    </ul>
  )
}

export default DrawerMenu