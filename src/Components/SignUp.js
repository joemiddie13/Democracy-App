import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    setErrorMessages([]);

    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setShowSuccessAlert(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setErrorMessages([data.message]); // Adjust according to your backend response
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessages(['An unexpected error occurred. Please try again later.']);
      setShowErrorAlert(true);
    }
  };

  const dismissAlert = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    setErrorMessages([]);
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      {showSuccessAlert && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Account created successfully! Redirecting to login...</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={dismissAlert}
                  className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showErrorAlert && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error with your submission</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errorMessages.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={dismissAlert}
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-semibold text-center text-gray-800">Sign Up ✍🏽</h2>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="first_name" className="block text-sm font-semibold text-gray-600">First Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last_name" className="block text-sm font-semibold text-gray-600">Last Name</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
