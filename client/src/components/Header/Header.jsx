import React, { useState } from "react";
import "./header.css";
import { motion } from "framer-motion";
import { Container, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import { cartActions } from "../../redux/slices/cartSlice";
import logo from "../../assets/images/logo.PNG";
import cart from "../../assets/images/cart.svg";
import profile from "../../assets/images/profile.svg";

const Header = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cart");
        const { cartItems, totalAmount, totalQuantity } = response.data;
        console.log(cartItems);
        dispatch(cartActions.setItems({ cartItems, totalAmount, totalQuantity }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCartItems();
  });

  const navigateToCart = () => {
    navigate("/cart");
  };

  const handleProfileClick = () => {
    axios.defaults.withCredentials = true;
    setIsMenuOpen(!isMenuOpen);
    return axios.get("http://localhost:5000/user/").then((response) => {
      setName(response.data.name);
    });
  };

  const handleLogoutClick = async () => {
    try {
      await axios.post('http://localhost:5000/logout/');
      window.location.reload(); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="header">
      <Container>
        <Row>
          <div className="wapper">
            <Link to="/home" className="logo">
              <img src={logo} alt="logo" />
              <div className="name">
                <h1>Vintage Room</h1>
                <p>Selected vintage made in France</p>
              </div>
            </Link>
            <div className="icons">
              <span className="cart" onClick={navigateToCart}>
                <motion.img whileTap={{ scale: 1.2 }} src={cart} alt="cart" />
                <span className="counter">{totalQuantity}</span>
              </span>
              <span className="profile" onClick={handleProfileClick}>
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={profile}
                  alt="profile"
                />
                {isMenuOpen && (
                  <div className="menu">
                    {name ? (
                      <div>
                        <div className="menu__name">Hi, {name}</div>
                        <div className="menu__logout" onClick={handleLogoutClick}>Logout</div>
                      </div>
                    ) : (
                      <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">SignUp</Link>
                      </div>
                    )}
                  </div>
                )}
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
