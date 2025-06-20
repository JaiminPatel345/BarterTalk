import { answerCall as answerCallAPI } from "../api/call";

const setAnswerCall = async (videoCallId, messageId) => {
  try {
    await answerCallAPI(videoCallId, messageId);
  } catch (error) {
    // Optionally handle error
  }
};

export default setAnswerCall;
