
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import '../admin/admin.css';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    fetch('http://localhost:5000/userData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok' && data.data.userType === 'admin') {
          setAdminData(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching admin data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!adminData) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="container">
      {/* Left sidebar */}
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li>
            <a href="/images">Images</a>
          </li>
          <li>
            <a href="/users">Users</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <a href="#">Reports</a>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Header with admin name and logout */}
        <div className="header">
          <div className="welcome-message">
            Welcome, {adminData.fname} {adminData.lname}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('loggedIn');
              window.location.href = '/sign-in';
            }}
          >
            Logout
          </button>
        </div>

        {/* Main dashboard content */}
        <div className="dashboard-card">
          <h3>Dashboard Overview</h3>
          <p>Welcome to the Admin Dashboard! Here you can manage users, settings, and other administrative tasks.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
