import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user state from localStorage
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Basic sanity check: token must exist (assuming it's not a dummy object)
        if (parsedUser && parsedUser.token) {
          setUser(parsedUser);
          console.debug('Auth restored for:', parsedUser.email || parsedUser.name);
        } else {
            console.warn('Invalid user session found, clearing...');
            localStorage.removeItem('userInfo');
        }
      } catch (error) {
        console.error('Failed to parse userInfo:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading: loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
