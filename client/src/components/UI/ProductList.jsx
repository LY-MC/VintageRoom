import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <ProductCard key={item.id} item={item} id={item.id} />
      ))}
    </>
  );
};

export default ProductList;
