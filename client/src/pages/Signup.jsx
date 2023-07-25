import React, { useState } from "react";
import axios from "axios";
import "./entry.css";
import { toast } from "react-toastify";
import WebName from "../components/WebName/WebName";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [countdown, setCountdown] = useState(4);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/signup/", formData);
      console.log(response.data);
      
  
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      if (response.data.success) {
        toast.success(response.data.message);
        const delay = countdown * 1000;
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
  
      setTimeout(() => {
        clearInterval(interval);
        navigate("/login");
      }, delay);
      } else {
        toast.error(response.data.message);
      }
      
      
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
      console.error(error);
    }
  };  
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
    
  return (
    <WebName title="SignUp">
      <div className="entry-container">
        <div className="entry-frame">
          <h2>Sign Up</h2>
          <form className="entry__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="entry__label" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="entry__input"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="entry__label" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="entry__input"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="entry__label" htmlFor="password">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="entry__input"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="buy__btn">
              Sign Up
            </button>
          </form>
          <div className="entry__signup">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
    </WebName>
  );
};
export default SignUp;
