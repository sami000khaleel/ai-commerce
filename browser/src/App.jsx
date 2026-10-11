import { useState, useEffect } from "react";
import api from "./api/api";
import { Image, ImageDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Navbar/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import "./index.css";
import ModalPopup from "./components/ModalPopup/ModalPopup";
import Cookies from "js-cookies";
import { signal } from "@preact/signals-react";
export const itemsCountSignal = signal(
  localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")).length
    : 0
);
const App = () => {
  const [loadingFlag, setLoadingFlag] = useState(false);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [modalState, setModalState] = useState({
    message: "",
    status: "",
    errorFlag: false,
    hideFlag: true,
  });
  const [itemsCount, setItemsCount] = useState(0);
  const navigate = useNavigate();
  const [error, setError] = useState({ message: "", status: null });
  const [file, setFile] = useState("");
  const [navbarFlag, setNavbarFlag] = useState(false);
  console.log(products);
  useEffect(() => {
    Cookies.getItem("token") ? setNavbarFlag(true) : setNavbarFlag(false);
    if (location.pathname == "/") navigate("/home");
  }, [location.pathname]);
  async function handleImageUpload(e) {
    const file = event.target.files[0];
    if (!Cookies.getItem("token")) {
      setModalState({
        message: "you need to be logged in first",
        status: 403,
        errorFlag: true,
        hideFlag: false,
      });
      return;
    }
    // Check if file is an image
    const fileType = file.type.split("/")[0];
    if (fileType !== "image") {
      setModalState({
        message: "please upload an image",
        status: null,
        errorFlag: true,
        hideFlag: false,
      });
      return;
    }

    // Check file size
    const fileSize = file.size / (1024 * 1024); // in MB
    if (fileSize > 5) {
      setModalState({
        message: "images size must be less than 5 mb",
        status: null,
        errorFlag: true,
        hideFlag: false,
      });
      return;
    }
    try {
      setLoadingFlag(true);
      if (!Cookies.getItem("token"))
        return setModalState({
          message: "you to have an account first",
          status: 403,
          errorFlag: true,
          hideFlag: false,
        });
      navigate("/home");
      const response = await api.searchByImage(file);
      setProducts(response.data);
      console.log(response.data);
      setLoadingFlag(false);
      setModalState({
        message: "images similar to yours have been fetched successfully ",
        status: 200,
        errorFlag: false,
        hideFlag: false,
      });
    } catch (error) {
      setLoadingFlag(false);
      setModalState({
        message: error.response.data.message,
        status: error.response.status,
        hideFlag: false,
        errorFlag: true,
      });
    }
  }
  return (
    <main
      className="relative min-h-screen "
    >
      {loadingFlag ? (
        <div className="loading-state-main">
          <div className="loading-main"></div>
        </div>
      ) : null}
      {!modalState?.hideFlag ? (
        <ModalPopup setModalState={setModalState} modalState={modalState} />
      ) : null}
      <Navbar
        setModalState={setModalState}
        modalState={modalState}
        setProducts={setProducts}
      />
      <div className="cursor-pointer bg-[rgba(0,0,0,0.2)] shadow-md text-center right-0 flex justify-center items-center fixed  w-[50px] z-[900] aspect-square rounded-full  ">
        <ImageDown cursor={"pointer"} size={30} />
        <input
          onChange={handleImageUpload}
          type="file"
          className="  absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          name="image"
          id="image"
          accept="image/*"
        />
      </div>
      <section id="outlet " className="mt-20 flex justify-center items-center">
        <Outlet
          context={{
            setItemsCount,
            setModalState,
            modalState,
            products,
            setProducts,
          }}
        />
      </section>
    </main>
  );
};

export default App;
