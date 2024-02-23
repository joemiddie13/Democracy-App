import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userEmail: null,
  });

  const login = (email) => {
    setAuthState({ isLoggedIn: true, userEmail: email });
  };

  const logout = () => {
    setAuthState({ isLoggedIn: false, userEmail: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
