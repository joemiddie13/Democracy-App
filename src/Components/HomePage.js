import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <div className="sticky top-0 bg-purple-600 py-4">
        <nav className="flex justify-center space-x-4">
          <Link to="/signup" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
          <Link to="/login" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
          <Link to="/candidates" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Candidates</Link>
          <Link to="/about" className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">About</Link>
        </nav>
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center my-8">Welcome to the Democracy App</h1>
        <p className="text-xl text-center mb-8">
          Explore candidates, make informed decisions, and cast your vote with confidence.
        </p>
      </div>
    </>
  );
};

export default HomePage;
