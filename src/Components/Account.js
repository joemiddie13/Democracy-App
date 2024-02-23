import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const Account = () => {
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
  const { authState } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user-details?email=${authState.userEmail}`, {
          method: 'GET',
        });
        const data = await response.json();
        if (response.ok) {
          setUserDetails({ firstName: data.firstName, lastName: data.lastName });
        } else {
          alert('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (authState.isLoggedIn) {
      fetchUserDetails();
    }
  }, [authState.isLoggedIn, authState.userEmail]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Welcome, {userDetails.firstName} {userDetails.lastName}!</h1>
    </div>
  );
};

export default Account;
