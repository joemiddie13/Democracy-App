import React, { createContext, useContext, useState, useEffect } from 'react';

// Creating a new Context object. This is used to pass data through the component tree without having to pass props down manually at every level
const AuthContext = createContext();

// AuthProvider is a component that will wrap around parts of our app we want to have access to this context
export const AuthProvider = ({ children }) => {
  // authState keeps track of the user's login status and email, initializing from localStorage to maintain state through page refreshes
  const [authState, setAuthState] = useState({
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
    userEmail: localStorage.getItem('userEmail') || null,
  });

  // useEffect hook to update localStorage whenever authState changes. This ensures persistence of auth state
  useEffect(() => {
    localStorage.setItem('isLoggedIn', authState.isLoggedIn);
    localStorage.setItem('userEmail', authState.userEmail);
  }, [authState.isLoggedIn, authState.userEmail]);

  // login function updates authState to reflect that the user has successfully logged in and sets the user's email
  const login = (email) => {
    setAuthState({ isLoggedIn: true, userEmail: email });
  };

  // logout function clears the authState and removes user data from localStorage, effectively logging the user out
  const logout = () => {
    setAuthState({ isLoggedIn: false, userEmail: null });
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
  };

  // AuthContext.Provider component passes the authState and auth functions down to any child components that need them
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children} {/* children represents the components that AuthProvider will wrap and provide auth context to */}
    </AuthContext.Provider>
  );
};

// Custom hook useAuth provides a simple and reusable way to access our auth context values (authState, login, logout)
export const useAuth = () => useContext(AuthContext);
