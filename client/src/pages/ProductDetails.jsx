import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import { useDispatch} from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import WebName from "../components/WebName/WebName";
import ProductList from "../components/UI/ProductList";
import "./productDetails.css";
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const dispatch = useDispatch();

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  useEffect(() => {
    async function getProducts() {
      const response = await fetch(`http://localhost:5000/record/`);
  
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
  
      const products = await response.json(); 
      setProducts(products);
    }
  
    getProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const product = products.find((item) => parseInt(item.id) === parseInt(id));
      setProduct(product);
    }
  }, [id, products]);  

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
  
  const { imgUrl, productName, size, category, price, shortDesc, description } =
    product || {};

  const relatedProducts = products.filter(
    (prod) => prod.category === category && prod.id !== id
  );

  const addToCart = async () => {
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
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <WebName title={productName}>
      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              <img className="product__image" src={imgUrl} alt={productName} />
            </Col>
            <Col lg="6">
              <div className="details">
                <h2 className="product__name">{productName}</h2>
              </div>
              <span className="product__price">€{price}</span>
              <div className="product__size">Size: {size}</div>
              <div className="product__category">Category: {category}</div>
              <p className="product__description">
                Description:
                <br />
                {showDescription ? description : shortDesc}
              </p>

              <button className="show-more__btn" onClick={toggleDescription}>
                {showDescription ? "Show Less" : "Show More"}
              </button>

              <button className="buy__btn" onClick={addToCart}>
                Add to Cart
              </button>
            </Col>

            <Col lg="12">
              <h2 className="related__title">You might also like:</h2>
            </Col>
            <ProductList data={relatedProducts}></ProductList>
          </Row>
        </Container>
      </section>
    </WebName>
  );
};

export default ProductDetails;