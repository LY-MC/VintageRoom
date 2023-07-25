import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import ProductDetails from "../pages/ProductDetails";
import Signup from "../pages/Signup";

function Routers() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="home" element={ <Home /> } />
      <Route path="home/:id" element={<ProductDetails />} />
      <Route path="cart" element={ <Cart />  } />
      <Route path="checkout" element={ <Checkout /> } />
      <Route path="login" element={<Login />}/>
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
}

export default Routers;
