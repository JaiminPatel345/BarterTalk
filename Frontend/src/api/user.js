import axiosInstance from './axiosInstance';

export const updateProfile = async (profileData) => {
  const response = await axiosInstance.post('/user/profile', profileData);
  return response.data;
};

export const getUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const getCloudinarySignature = async (folder = 'user_uploads') => {
  const response = await axiosInstance.get(`/cloudinary/signature?folder=${encodeURIComponent(folder)}`);
  return response.data;
}; 