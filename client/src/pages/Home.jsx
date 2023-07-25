import React, { useState, useEffect, useRef } from "react";
import WebName from "../components/WebName/WebName";
import { Container, Row, Col } from "reactstrap";
import ProductList from "../components/UI/ProductList";
import "./home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
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

  const [productsData, setProductsData] = useState([]);
  const [filterValue, setFilterValue] = useState("default");
  const searchInputRef = useRef(null);

  useEffect(() => {
    async function filterProducts() {
      if (filterValue === "default") {
        setProductsData(products);
      } else {
        const [category, size] = filterValue.split("-");
        const response = await fetch(`http://localhost:5000/filter?category=${category}&size=${size}`);
        const filteredProducts = await response.json();
        console.log(filteredProducts);
        setProductsData(filteredProducts);
      }
    }

    filterProducts();
  }, [filterValue]);

  const handlerSearch = (e) => {
    const searchTerm = e.target.value;
  
    const searchedProducts = productsData.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    setProductsData(searchedProducts);
  };
  

  useEffect(() => {
    setProductsData(products);
  }, [products]);

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    searchInputRef.current.value = "";
    setFilterValue(filterValue);
  };

  return (
    <WebName title={"Home"}>
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="filter">
                <label htmlFor="categories">Filter by category:</label>
                <select
                  name="categories"
                  onChange={handleFilter}
                  value={filterValue}
                >
                  <option value="default">Default</option>
                  <optgroup label="Sweater">
                    <option value="Sweater-all">All Sizes</option>
                    <option value="Sweater-S">Small</option>
                    <option value="Sweater-M">Medium</option>
                    <option value="Sweater-L">Large</option>
                    <option value="Sweater-XL">Extra Large</option>
                  </optgroup>
                  <optgroup label="Shirt">
                    <option value="Shirt-all">All Sizes</option>
                    <option value="Shirt-S">Small</option>
                    <option value="Shirt-M">Medium</option>
                    <option value="Shirt-L">Large</option>
                    <option value="Shirt-XL">Extra Large</option>
                  </optgroup>
                </select>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="search">
                <input
                  type="text"
                  placeholder="Search for items"
                  ref={searchInputRef}
                  onChange={handlerSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container className="product-list-container">
          <Row>
            {productsData.length === 0 ? (
              <h1>No products are found.</h1>
            ) : (
              <ProductList data={productsData} />
            )}
          </Row>
        </Container>
      </section>
    </WebName>
  );
};

export default Home;
