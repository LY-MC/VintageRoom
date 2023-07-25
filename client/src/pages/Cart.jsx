import React from "react";
import "./cart.css";
import axios from 'axios';

import WebName from "../components/WebName/WebName";
import { cartActions } from "../redux/slices/cartSlice";

import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cart");
        const { cartItems, totalAmount, totalQuantity } = response.data;
        dispatch(cartActions.setItems({ cartItems, totalAmount, totalQuantity }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCartItems();
  }, [cartItems]);

  const checkoutCart = async () => {
    try {
      const response = await axios.post('http://localhost:5000/checkout');
      return response.data.success;
    } catch (error) {
      console.error(error);
    }
  };
  
  const checkoutButton =
    cartItems.length > 0 ? (
      <div className="cart__btn">
        <Link className="buy__link" to="/checkout" onClick={checkoutCart}>
          Checkout
        </Link>
      </div>
    ) : null;

  return (
    <WebName title="Cart">
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cartItems.length === 0 ? (
                <h2 className="message">The cart is empty.</h2>
              ) : (
                <div>
                  <h1 className="cart__header">Cart</h1>
                  <table className="cart__table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Size</th>
                        <th>Delete</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cartItems.map((item, index) => (
                        <Tr item={item} key={index} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Col>
            <Col lg="3">
              <div className="info">
                <div className="price-container">
                  <h6 className="price__text">Subtotal:&nbsp;</h6>
                  <span className="price__number">€{totalAmount}</span>
                </div>
                <p>Taxes and shipping cost will be calculated in checkout.</p>
                <div className="cart__btn-container">
                  <div className="cart__btn">
                    <Link className="buy__link" to="/home">
                      Continue shopping
                    </Link>
                  </div>
                  {checkoutButton}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </WebName>
  );
};

const Tr = ({ item }) => {
  const deleteProduct = () => {
    axios.delete(`http://localhost:5000/delete-from-cart/${item.id}`)
  };
  return (
    <tr>
      <td>
        <img src={item.imgUrl} alt="" />
      </td>
      <td>{item.productName}</td>
      <td>{item.price}</td>
      <td>{item.size}</td>
      <motion.td whileTap={{ scale: 1.2 }} onClick={deleteProduct}>
        <i class="ri-delete-bin-5-fill"></i>
      </motion.td>
    </tr>
  );
};
export default Cart;
