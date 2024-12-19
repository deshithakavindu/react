import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import map from './components/map/map';
import all from './components/all';
import Login from './components/login/login.component';
import SignUp from './components/register/signup.component';

import ModernProductHomepage from './components/home';
import AdminDashboard from './components/admin/admin';
import UserDashboard from './components/profile';
import UsersPage from './components/admin/users';
import Imagepage from './components/admin/images';
import { Images } from 'lucide-react';
import CardPage from './components/all';
import MapPage from './components/map/map';

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";

  return (
    <Router>
      <div>
        <Routes>

        <Route path="/" element={<Login/>} />

        <Route path="/sign-in" element={<Login />} />
          <Route path="/all" element={<CardPage/>}/>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/home" element={<ModernProductHomepage />} />
          <Route path="/users" element={<UsersPage/>}/>
          <Route path="/images" element={<Imagepage/>}/>
          <Route path="/map" element={<MapPage/>}/>
         
          
          <Route path="/profile" element={<UserDashboard />} />
          <Route path="/sign-up" element={<SignUp />} />
  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
