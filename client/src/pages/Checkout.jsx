import React, {useEffect, useState} from "react";
import axios from 'axios';
import "./checkout.css";

import WebName from "../components/WebName/WebName";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

const Checkout = () => {
  const [totalQty, setTotalQty] = useState(0);
  const [subtotalAmount, setSubtotalAmount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/order')
      .then((response) => {
        const { totalAmount, totalQuantity } = response.data;
        setSubtotalAmount(totalAmount);
        setTotalQty(totalQuantity);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const shipping = subtotalAmount < 50 ? 10 : 0;
  const taxes = 5 % subtotalAmount;
  const totalAmount = subtotalAmount + shipping + taxes;
  return (
    <WebName title="Checkout">
      <h1 className="checkout__header">Checkout</h1>
      <Container className="checkout__wrapper">
        <Row>
          <Col>
            <div className="checkout__cart">
              <h2>Order Information:</h2>
              <h6>
                Total quantity: <span>{totalQty}</span>
              </h6>
              <h6>
                Subtotal: <span>€{subtotalAmount}</span>
              </h6>
              <h6>
                Shipping:{" "}
                <span>
                  {" "}
                  €{shipping}{" "}
                  <p className="checkout__paragraph">
                    (Free shipping from €50)
                  </p>
                </span>
              </h6>
              <h6>
                Taxes: <span>€{taxes}</span>
              </h6>
              <h4>
                Total cost: <span>€{totalAmount}</span>
              </h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form>
              <h2 className="form__name">Billing Information</h2>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="checkout__input"
                />
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="checkout__input"
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  className="checkout__input"
                />
              </FormGroup>
              <FormGroup>
                <Label for="address">Address</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  className="checkout__input"
                />
              </FormGroup>
              <FormGroup>
                <Label for="country">Country</Label>
                <Input
                  type="text"
                  name="country"
                  id="country"
                  className="checkout__input"
                />
              </FormGroup>
              <FormGroup>
                <Label for="city">City</Label>
                <Input
                  type="text"
                  name="city"
                  id="city"
                  className="checkout__input"
                />
              </FormGroup>
            </Form>
          </Col>
          <Col md="6">
            <Form>
              <h2 className="form__name">Payment Information</h2>
              <FormGroup>
                <Label for="nameOnCard">Name on Card</Label>
                <Input
                  type="text"
                  name="nameOnCard"
                  id="nameOnCard"
                  className="checkout__input"
                />
              </FormGroup>
              <FormGroup>
                <Label for="cardNumber">Card Number</Label>
                <Input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  className="checkout__input"
                />
              </FormGroup>
              <FormGroup>
                <Label for="expiration">Expiration Date</Label>
                <Input
                  type="text"
                  name="expiration"
                  id="expiration"
                  className="checkout__input"
                />
              </FormGroup>
              <FormGroup>
                <Label for="cvv">CVV</Label>
                <Input
                  type="text"
                  name="cvv"
                  id="cvv"
                  className="checkout__input"
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <div className="checkout__btn-container">
          <div className="buy__btn">
            <Link className="buy__link" to="/home">
              Continue shopping
            </Link>
          </div>
          <button className="buy__btn">Place Order</button>
        </div>
      </Container>
    </WebName>
  );
};

export default Checkout;
