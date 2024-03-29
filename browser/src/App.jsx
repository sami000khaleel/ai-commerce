import { useState, useEffect } from "react";
import api from "./api/api";
import Footer from './components/Footer'
import Navbar from './components/Navbar/Navbar'
import { Outlet } from "react-router-dom";
import './index.css'
import Cookies from "js-cookies";
const App = () => {
 
  return (
    <main className="min-h-screen relative">
      <Navbar/>
      <section id='outlet'>
      <Outlet />
      </section>
      <Footer/>
    </main>
    );
};

export default App;
