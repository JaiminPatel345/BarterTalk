const doVideoCall = async (
  selectedUser,
  showErrorMessage,
  remotePeerId,
  peerId,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/call`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        toUserId: selectedUser._id,
        toName: selectedUser.name,
        remotePeerId,
        peerId,
      }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    showErrorMessage(data.message || "Failed to initiate video call");
    return;
  }
  return JSON.parse(data.message);
};

export default doVideoCall;
