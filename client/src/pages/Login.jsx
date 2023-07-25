import React, { useState } from "react";
import axios from "axios";
import "./entry.css";
import { toast } from "react-toastify";
import WebName from "../components/WebName/WebName";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [countdown, setCountdown] = useState(4);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/login/",
        formData
      );
      console.log(response.data);

      if (response.data.success) {
        setFormData({
          email: "",
          password: "",
        });
        const message = response.data.message;
        toast.success(message);
        const delay = countdown * 1000;
        const interval = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(interval);
          navigate("/home");
        }, delay);
      } else {
        const message = response.data.message;
        toast.error(message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response.data.message;
        toast.error(message);
      } else {
        toast.error("An unknown error occurred.");
      }
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

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/forgot-password",
        { email: formData.email }
      );
      console.log(response.data);

      if (response.data.success) {
        const message = response.data.message;
        toast.success(message);
        setShowForgotPassword(false);
      } else {
        const message = response.data.message;
        toast.error(message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response.data.message;
        toast.error(message);
      } else {
        toast.error("An unknown error occurred.");
      }
      console.error(error);
    }
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:5000/update-password",
        { email: formData.email, newPassword: newPassword }
      );
      console.log(response.data);

      if (response.data.success) {
        const message = response.data.message;
        toast.success(message);
        setNewPassword("");
        setShowForgotPassword(false);
      } else {
        const message = response.data.message;
        toast.error(message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response.data.message;
        toast.error(message);
      } else {
        toast.error("An unknown error occurred.");
      }
      console.error(error);
    }
  };

  return (
    <WebName title="Login">
      <div className="entry-container">
      <div className="entry-frame"> 
        <h2>Login</h2>
        <form form className="entry__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="entry__label" htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              className="entry__input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="entry__label" htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              className="entry__input"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="buy__btn">Login</button>
          </div>
        </form>
        <div className="forgot-password-container">
          {!showForgotPassword && (
            <button onClick={() => setShowForgotPassword(true)} className="buy__btn">
              Forgot password?
            </button>
          )}
          {showForgotPassword && (
            <form form className="entry__form" onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="entry__label" htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="entry__input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <button onClick={() => setShowForgotPassword(false)} className="buy__btn">
                  Cancel
                </button >
              </div>
            </form>
          )}
        </div>
        {showForgotPassword && (
          <div className="new-password-container">
            <form form className="entry__form" onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label className="entry__label" htmlFor="newPassword">New password:</label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="entry__input"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <button type="submit" className="buy__btn">Reset password</button>
              </div>
            </form>
          </div>
        )}
        </div>
      </div>
    </WebName>
  );
};

export default Login;
