import { doVideoCall as doVideoCallAPI } from "../api/call";

const doVideoCall = async (selectedUser, showErrorMessage) => {
  try {
    const data = await doVideoCallAPI(selectedUser._id, selectedUser.name);
    return data;
  } catch (error) {
    showErrorMessage(error.message || "Failed to initiate video call");
    return;
  }
};

export default doVideoCall;
