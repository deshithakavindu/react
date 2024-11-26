import React, { Component } from 'react';
import '../register/register.css';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "", 
      userType: "user",
      secretKey: "",
      errors: {},
      successMessage: ""
    };
  }

  validateForm = () => {
    const { fname, lname, email, password, userType, secretKey } = this.state;
    const errors = {};

    // First Name Validation
    if (!fname) {
      errors.fname = "First name is required";
    } else if (fname.length < 2) {
      errors.fname = "First name must be at least 2 characters";
    }

    // Last Name Validation
    if (!lname) {
      errors.lname = "Last name is required";
    } else if (lname.length < 2) {
      errors.lname = "Last name must be at least 2 characters";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }

    // Password Validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Admin Secret Key Validation
    if (userType === "admin" && secretKey !== "maha") {
      errors.secretKey = "Secret key is required for Admin";
    }

    return errors;
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      errors: { ...this.state.errors, [name]: undefined }
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validateForm();

    if (Object.keys(errors).length === 0) {
      const { fname, lname, email, password, userType, secretKey } = this.state;

      fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ 
          fname, 
          lname, 
          email, 
          password, 
          userType, 
          secretKey 
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          this.setState({ 
            errors: { submit: data.error },
            successMessage: "" 
          });
        } else {
          this.setState({ 
            successMessage: "Registration successful!",
            errors: {} 
          });
        }
      })
      .catch((error) => {
        this.setState({
          errors: { submit: "Registration failed. Please try again." },
          successMessage: ""
        });
      });
    } else {
      this.setState({ errors, successMessage: "" });
    }
  };

  render() {
    const { errors, successMessage, userType } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>

        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="form-control">
          <label>Register as</label>


          <br/>
          <div>
            <input
              type="radio"
              name="userType"
              value="user"
              checked={userType === "user"}
              onChange={this.handleInputChange}
            /> User
            <input
              type="radio"
              name="userType"
              value="admin"
              checked={userType === "admin"}
              onChange={this.handleInputChange}
            /> Admin
          </div>
        </div>

        {userType === "admin" &&  (
          <div className={`form-control ${errors.secretKey ? 'error' : ''}`}>
            <label>Secret Key</label>
            <input
              type="text"
              name="secretKey"
              placeholder="Secret key"
              onChange={this.handleInputChange}
            />
            {errors.secretKey && <small className="error-message">{errors.secretKey}</small>}
          </div>
        )}
        <br/>
        <div className={`form-control ${errors.fname ? 'error' : ''}`}>
          <label>First Name</label>
          <input
            type="text"
            name="fname"
            placeholder="First name"
            onChange={this.handleInputChange}
          />
          {errors.fname && <small className="error-message">{errors.fname}</small>}
        </div>

        <div className={`form-control ${errors.lname ? 'error' : ''}`}>
          <label>Last Name</label>
          <input
            type="text"
            name="lname"
            placeholder="Last name"
            onChange={this.handleInputChange}
          />
          {errors.lname && <small className="error-message">{errors.lname}</small>}
        </div>

        <div className={`form-control ${errors.email ? 'error' : ''}`}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={this.handleInputChange}
          />
          {errors.email && <small className="error-message">{errors.email}</small>}
        </div>

        <div className={`form-control ${errors.password ? 'error' : ''}`}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={this.handleInputChange}
          />
          {errors.password && <small className="error-message">{errors.password}</small>}
        </div>

        <button type="submit" className="btn-submit">
          Sign Up
        </button>

        <p>
          Already registered? <a href="/sign-in">Sign in</a>
        </p>
      </form>
    );
  }
}