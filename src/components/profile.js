import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
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
        if (data.status === 'ok' && data.data.userType === 'user') {
          setUserData(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!userData) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with user name */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">User Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {userData.fname} {userData.lname}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('loggedIn');
                window.location.href = '/sign-in';
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User profile card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {userData.fname} {userData.lname}</p>
              <p><span className="font-medium">Email:</span> {userData.email}</p>
            </div>
          </div>

          {/* Upload image card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Upload New Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;