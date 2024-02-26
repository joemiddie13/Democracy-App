import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
    userEmail: localStorage.getItem('userEmail') || null,
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', authState.isLoggedIn);
    localStorage.setItem('userEmail', authState.userEmail);
  }, [authState.isLoggedIn, authState.userEmail]);

  const login = (email) => {
    setAuthState({ isLoggedIn: true, userEmail: email });
  };

  const logout = () => {
    setAuthState({ isLoggedIn: false, userEmail: null });
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
