import axiosInstance from './axiosInstance';

export const doVideoCall = async (toUserId, toName) => {
  const response = await axiosInstance.post('/call', { toUserId, toName });
  return response.data;
};

export const rejectVideoCall = async (cutTo) => {
  const response = await axiosInstance.post('/call/reject-call', { cutTo });
  return response.data;
};

export const answerCall = async (callId, messageId) => {
  const response = await axiosInstance.post('/call/answer-call', { callId, messageId });
  return response.data;
}; 