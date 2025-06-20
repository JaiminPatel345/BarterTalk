import { rejectVideoCall as rejectVideoCallAPI } from "../api/call";

const rejectVideoCall = async (selectedUserId, showErrorMessage) => {
  try {
    const data = await rejectVideoCallAPI(selectedUserId);
    return data;
  } catch (error) {
    showErrorMessage(error.message || "Failed to reject video call");
    return;
  }
};

export default rejectVideoCall;
