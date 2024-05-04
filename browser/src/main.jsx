import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { CartPage, Home, Login, Signup, Product } from "./Pages";
import Signout from "./Pages/Signout";
import RecoverAccount from "./Pages/RecoverAccount";
import ResetPassword from "./Pages/ResetPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/recover-account",
        element: <RecoverAccount/>,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
       
      {
        path: "/signout",
        element: <Signout />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/product/:productId",
        element: <Product />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <App  />
  </RouterProvider>
);
