const setAnswerCall = async (videoCallId, messageId) => {
  const response = await fetch(
    `${process.env.VITE_API_BASE_URL}/api/call/answer-call`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ callId: videoCallId, messageId }),
    },
  );
  const data = await response.json();
  // console.log(data);
};

export default setAnswerCall;
