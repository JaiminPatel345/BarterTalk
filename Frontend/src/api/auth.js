import axiosInstance from './axiosInstance';

export const login = async (data) => {
  const response = await axiosInstance.post('/login', data);
  return response.data;
};

export const signup = async (data) => {
  const response = await axiosInstance.post('/signup', data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/logout');
  return response.data;
}; 