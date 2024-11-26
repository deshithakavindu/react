import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/login/login.component';
import SignUp from './components/register/signup.component';
import UserDetails from './components/userDetails';
import ModernProductHomepage from './components/home';
import AdminDashboard from './components/admin/admin';
import UserDashboard from './components/profile';
import UsersPage from './components/admin/users';
import Imagepage from './components/admin/images';
import { Images } from 'lucide-react';

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";

  return (
    <Router>
      <div>
        <Routes>


        <Route path="/sign-in" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/home" element={<ModernProductHomepage />} />
          <Route path="/users" element={<UsersPage/>}/>
          <Route path="/images" element={<Imagepage/>}/>
          <Route
            path="/"
            element={
              <div className="auth-wrapper">
                <div className="auth-inner">
                  {isLoggedIn ? <UserDetails /> : <Login />}
                </div>
              </div>
            }
          />
          
          <Route path="/profile" element={<UserDashboard />} />
          <Route path="/sign-up" element={<SignUp />} />
          
          <Route
            path="/userDetails"
            element={
              <div className="auth-wrapper">
                <div className="auth-inner">
                  <UserDetails />
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
