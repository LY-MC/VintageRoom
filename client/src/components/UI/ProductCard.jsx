import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./productCard.css";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";

const ProductCard = ({ item, id }) => {
  const dispatch = useDispatch();

  const addToCart = useCallback(async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/add-to-cart/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (err) {
      const message = err.response.data.message;
      toast.error(message);
      console.error(err);
    }
  }, [id]);

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
  });

  return (
    <Col lg="3" md="4" sm="6" xs="12">
      <div className="product item">
        <div className="product img">
          <Link to={`/home/${item.id}`}>
            <motion.img whileHover={{ scale: 0.9 }} src={item.imgUrl} alt="" />
          </Link>
        </div>
        <div className="p-2 product__info">
          <h3 className="product__name">
            <Link to={`/home/${item.id}`}>{item.productName}</Link>
          </h3>
          <span className="product__category">
            {item.category}. Size: {item.size}
          </span>
          <div className="product card-bottom d-flex align-items-center justify-content-between p-2">
            <span className="price">€{item.price}</span>
            <motion.span whileTap={{ scale: 1.2 }} onClick={addToCart}>
              <i className="ri-add-line"></i>
            </motion.span>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
