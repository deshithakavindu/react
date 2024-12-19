import React, { Component } from "react";
import "../login/login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberMe: false,
      loading: false,
      errorMessage: "",
      successMessage: "",
    };
  }

  // Handle input changes for form fields
  handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    this.setState({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "", successMessage: "" });

    const { email, password } = this.state;

    try {
      const res = await fetch("http://localhost:5000/login-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data, "userLogin");

      if (data.status === "ok" && data.message === "Login successful") {
        window.localStorage.setItem("token", data.data);
        window.localStorage.setItem("loggedIn", true);

        // Fetch user data to determine user type
        const userDataRes = await fetch("http://localhost:5000/userData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: data.data }),
        });

        const userData = await userDataRes.json();

        if (userData.status === "ok") {
          // Redirect based on user type
          if (userData.data.userType === "admin") {
            window.location.href = "./admin";
          } else {
            window.location.href = "./all";
          }
        }
      } else {
        this.setState({ errorMessage: "Login failed, please try again." });
      }
    } catch (error) {
      console.error("Error during login:", error);
      this.setState({ errorMessage: "An error occurred. Please try again later." });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { email, password, rememberMe, loading, errorMessage } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="login-form">
        <h3 className="login-heading">Sign In</h3>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <div className="input-group">
          <label htmlFor="email" className="input-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className="input-field"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={this.handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="input-field"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={this.handleInputChange}
            required
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="rememberMe"
            className="checkbox-input"
            id="rememberMe"
            checked={rememberMe}
            onChange={this.handleInputChange}
          />
          <label className="checkbox-label" htmlFor="rememberMe">
            Remember me
          </label>
        </div>

        <div className="submit-group">
          <button type="submit" className="button-submit" disabled={loading}>
            {loading ? "Logging in..." : "Submit"}
          </button>
        </div>

        <p className="forgot-password">
          Forgot <a href="/forgot">password?</a>
        </p>

        <p className="register-link">
          <a href="/sign-up"> register ?</a>
        </p>
      </form>
    );
  }
}
