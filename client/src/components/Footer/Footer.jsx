import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import Map from "./Map";
import { useLoadScript } from "@react-google-maps/api";

import logo from "../../assets/images/logo.PNG";
import "./footer.css";

const Footer = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAVuXXT-aBrrbnDT7AfNiYJK0Kj_nQn1VA",
  });
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3" md="6" sm="6" xs="12">
            <Link to="/home" className="logo">
              <img src={logo} alt="logo" />
              <div className="name">
                <h1>Vintage Room</h1>
                <p>Selected vintage made in France</p>
              </div>
            </Link>
          </Col>
          <Col lg="3" md="6" sm="6" xs="12">
            <h5>Connect with us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="https://www.instagram.com/vintageroom.md/">
                  <i class="ri-instagram-fill"></i> Instagram
                </a>
              </li>
              <li>
                <a href="https://t.me/vintageroom_md?fbclid=PAAabSx5DtAJR_mY_7Ua2ox8Cfv_MoXKXnQ-Rb0UF8GlHfVa298tj6fQItEIw">
                  <i class="ri-telegram-fill"></i> Telegram
                </a>
              </li>
            </ul>
          </Col>
          <Col lg="3" md="6" sm="6" xs="12">
            <h5>Visit us</h5>
            <address className="address">
              bd. Stefan cel Mare 64, Chisinau, Moldova
            </address>
            {!isLoaded && <div>Loading...</div>}
            {isLoaded && <Map />}
          </Col>
          <Col lg="3" md="6" sm="6" xs="12">
            <h5>Working Hours</h5>
            <ul className="list-unstyled">
              <li>Monday: Closed</li>
              <li>Tuesday - Saturday: 12pm to 8pm</li>
              <li>Sunday: 12pm to 7pm</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
