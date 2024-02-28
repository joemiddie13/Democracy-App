import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Components/AuthContext';
import './App.css';
import HomePage from './Components/HomePage.tsx';
import SignUp from './Components/SignUp';
import Account from './Components/Account';
import Login from './Components/Login';
import Candidates from './Components/Candidates';
import About from './Components/About.tsx';

const NavigationBar = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sticky top-0 bg-purple-600 py-4">
      <nav className="flex justify-between">
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Democracy App</Link>
          <Link to="/candidates" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Candidates</Link>
          <Link to="/about" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">About</Link>
        </div>
        {authState.isLoggedIn ? (
          <div className="flex space-x-4">
            <Link to="/account" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">{authState.userEmail}</Link>
            <button onClick={handleLogout} className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Sign Out</button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/signup" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
            <Link to="/login" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
          </div>
        )}
      </nav>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
