const rejectVideoCall = async (selectedUserId, showErrorMessage) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/call/reject-call`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        cutTo: selectedUserId,
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

export default rejectVideoCall;
