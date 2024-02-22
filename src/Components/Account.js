import React from 'react';
import { useLocation } from 'react-router-dom';

const Account = () => {
  const location = useLocation();
  const { email } = location.state || { email: 'your email' };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Welcome to Your Account</h1>
      <p className="text-xl text-center mb-8">
        Welcome, {email}!
      </p>
    </div>
  );
};

export default Account;

