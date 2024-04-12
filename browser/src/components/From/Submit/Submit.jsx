import React,{useState} from "react";

const Submit = ({
  setModalState,
  loginFlag,
  signupFlag,
  handleSignup,
  handleLogin,
  userData,
  location
}) => {
    const [loadingFlag, setLoadingFlag] = useState(false);
    async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoadingFlag(true);
      
      if (loginFlag) await handleLogin(userData);
      if(signupFlag) await handleSignup(userData,location);
    } catch (err) {
      console.log(err);
      setModalState({
        message: err.response.data.message,
        status: err.response.status,
        errorFlag:true,
        hideFlag:false
      });
    } finally {
      setLoadingFlag(false);
    }
  }
  return (
   !loadingFlag? <button  onClick={handleSubmit} className="bg-black text-white py-3 px-5  rounded-md hover:bg-[#333]">
      {loginFlag ? "login" : "signup"}
    </button>:<h1>loading</h1>
  );
};

export default Submit;
