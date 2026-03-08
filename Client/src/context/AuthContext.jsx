import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials, role) => {
    let response;
    if (role === 'user') {
      response = await authService.userLogin(credentials);
    } else if (role === 'organizer') {
      response = await authService.organizerLogin(credentials);
    } else if (role === 'admin') {
      response = await authService.adminLogin(credentials);
    }
    setUser(response.user);
    return response;
  };

  const signup = async (userData, role) => {
    let response;
    if (role === 'user') {
      response = await authService.userSignup(userData);
    } else if (role === 'organizer') {
      response = await authService.organizerSignup(userData);
    } else if (role === 'admin') {
      response = await authService.adminSignup(userData);
    }
    if (response.user) {
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    const currentUser = authService.getCurrentUser();
    const newUser = { ...currentUser, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
