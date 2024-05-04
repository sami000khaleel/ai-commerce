import React, { useState } from "react";
import ModalPopup from "../components/ModalPopup/ModalPopup";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import TextInput from "../components/From/TextInput/TextInput";
import Submit from "../components/From/Submit/Submit";
import api from "../api/api";
import Cookies from "js-cookies";
const RecoverAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [emailVerifiedFlag, setEmailVerifiedFlag] = useState(false);
  const { modalState, setModalState } = useOutletContext();
  console.log(code);
  async function handleGetCode(e) {
    e.preventDefault();
    try {
      setLoadingFlag(true);
      const response = await api.getCode(email);
      setLoadingFlag(false);
      setEmailVerifiedFlag(true);
    } catch (err) {
      console.log(err);
      setLoadingFlag(false);
      setModalState({
        message: err.response.data.message,
        status: err.response.status,
        errorFlag: true,
        hideFlag: false,
      });
    } finally {
      setLoadingFlag(false);
    }
  }
  async function handleSubmitCode(e) {
    e.preventDefault();
    try {
      setLoadingFlag(true);
      const { data } = await api.verifyCode(email, code);
      Cookies.setItem("token", data.token);
      setLoadingFlag(false);
      navigate("/reset-password");
    } catch (error) {
        console.log(error)
      setLoadingFlag(false);
      setModalState({
        message:
          "either the code is incorrect or you have not sent it within 30 seconds",
        status: error.response.status,
        errorFlag: true,
        hideFlag: false,
      });
    }
  }
  return (
    <span>
      {!modalState.hideFlag ? (
        <ModalPopup modalState={modalState} setModalState={setModalState} />
      ) : null}
      {!emailVerifiedFlag ? (
        <form
          id="recover account form "
          className="card shadow-xl border rounded-xl p-6 flex flex-col justify-center items-start gap-6"
        >
          <h1 className=" text-3xl"> recover your account</h1>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            className="'border relative p-3   bg-[hsla(0,0%,97%,1)] "
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleGetCode}
            className="bg-black text-white p-3 rounded-lg hover:bg-gray-800"
          >
            {loadingFlag ? "loading" : "get the code"}
          </button>
        </form>
      ) : (
        <form
          className="card shadow-xl border rounded-xl p-6 flex flex-col justify-center items-start gap-6"
          id="verify code"
        >
          <h1 className="text-3xl">type in your email</h1>
          <input
            type="number"
            name="code"
            id="code"
            value={code}
            className="'border relative p-3   bg-[hsla(0,0%,97%,1)] "
            placeholder="code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={handleSubmitCode}
            className="bg-black text-white p-3 rounded-lg hover:bg-gray-800"
          >
            {loadingFlag ? "loading" : "submit the code"}
          </button>
          <button onClick={e=>{
            e.preventDefault()
            setEmailVerifiedFlag(false)
        setCode('')
        setEmail('')}} >back</button>
        </form>
      )}
      <h1 className="mt-5">
        already have an account?{" "}
        <Link to="/signup" className="bg-black text-white p-2 rounded-md">
          signup
        </Link>{" "}
      </h1>
    </span>
  );
};

export default RecoverAccount;
