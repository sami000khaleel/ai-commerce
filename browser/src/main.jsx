import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Cart, Home, Login, Signup, Product } from "./Pages";
import Signout from "./Pages/Signout";

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
        path: "/login",
        element: <Login />,
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
        element: <Cart />,
      },
      {
        path: "/home/:productId",
        element: <Product />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
);
