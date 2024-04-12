import { useState, useEffect } from "react";
import api from "./api/api";
import Footer from './components/Footer'
import Navbar from './components/Navbar/Navbar'
import { Outlet } from "react-router-dom";
import './index.css'
import ModalPopup from "./components/ModalPopup/ModalPopup";
import Cookies from "js-cookies";
const App = () => {
 const [error,setError]=useState({message:'',status:null})

 return (
    <main className="min-h-screen relative">
      <Navbar/>
      <section id='outlet ' className="mt-20 flex justify-center items-center">
      <Outlet  />
      </section>
      <Footer/>
    </main>
    );
};

export default App;
