import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logoutUser, setLoading } from '../store/authSlice';
import api from '../utils/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await api.get('/auth/me');
          dispatch(setCredentials({ user: data.data, accessToken: token }));
        } else {
          dispatch(setLoading(false));
        }
      } catch (error) {
        dispatch(logoutUser());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
    return data;
  };

  const signup = async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    dispatch(logoutUser());
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
