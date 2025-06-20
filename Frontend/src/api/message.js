import axiosInstance from './axiosInstance';

export const sendMessage = async (conversationId, message) => {
  const response = await axiosInstance.post(`/message/send/${conversationId}`, { message });
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await axiosInstance.get(`/message/${conversationId}`);
  return response.data;
}; 