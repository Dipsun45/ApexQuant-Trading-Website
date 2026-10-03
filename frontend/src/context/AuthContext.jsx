import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('apexquant_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('apexquant_token') || null;
  });

  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Sync user room when user is logged in
  useEffect(() => {
    if (socket && user && user._id) {
      socket.emit('join_user_room', user._id);
    }
  }, [socket, user]);

  // Fetch current logged in user on refresh
  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('apexquant_user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.error('Failed to fetch user session:', error);
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token: jwtToken, data: userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('apexquant_token', jwtToken);
        localStorage.setItem('apexquant_user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Admin login handler
  const adminLogin = async (email, password) => {
    try {
      const res = await API.post('/auth/admin-login', { email, password });
      if (res.data && res.data.success) {
        const { token: jwtToken, data: adminData } = res.data;
        setToken(jwtToken);
        setUser(adminData);
        localStorage.setItem('apexquant_token', jwtToken);
        localStorage.setItem('apexquant_user', JSON.stringify(adminData));
        toast.success('Admin authenticated successfully!');
        return { success: true, user: adminData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Admin login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (formData) => {
    try {
      const res = await API.post('/auth/register', formData);
      if (res.data && res.data.success) {
        const { token: jwtToken, data: userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('apexquant_token', jwtToken);
        localStorage.setItem('apexquant_user', JSON.stringify(userData));
        toast.success('Account created successfully!');
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('apexquant_token');
    localStorage.removeItem('apexquant_user');
    toast.success('Logged out successfully');
  };

  // Update user profile local state helper
  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newObj = { ...prev, ...updatedData };
      localStorage.setItem('apexquant_user', JSON.stringify(newObj));
      return newObj;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        role: user?.role || null,
        socket,
        login,
        adminLogin,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
