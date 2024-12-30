const doVideoCall = async (selectedUser, showErrorMessage) => {
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
      }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    showErrorMessage(data.message || "Failed to initiate video call");
    return;
  }
  return data;
};

export default doVideoCall;
