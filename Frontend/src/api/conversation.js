import axiosInstance from './axiosInstance';

export const getMyGroups = async () => {
  const response = await axiosInstance.get('/groups');
  return response.data;
};

export const createGroup = async ({ name, members, avatarUrl }) => {
  const response = await axiosInstance.post('/groups', { name, members, avatarUrl });
  return response.data;
};

export const addGroupMembers = async (conversationId, members) => {
  const response = await axiosInstance.post(`/groups/${conversationId}/members`, { members });
  return response.data;
};

export const removeGroupMember = async (conversationId, memberId) => {
  const response = await axiosInstance.delete(`/groups/${conversationId}/members/${memberId}`);
  return response.data;
};

export const setAdmin = async (conversationId, memberId) => {
  const response = await axiosInstance.post(`/groups/${conversationId}/admins/${memberId}`);
  return response.data;
};

export const unsetAdmin = async (conversationId, memberId) => {
  const response = await axiosInstance.delete(`/groups/${conversationId}/admins/${memberId}`);
  return response.data;
};


