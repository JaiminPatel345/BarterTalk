const setProfileFromGoogleSignup = async (profile) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/signup?bygoogle=1`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
      credentials: "include",
    },
  );
  const responseData = await response.json();
  if (response.ok) {
    console.log(responseData);
    return responseData;
  } else {
    console.log(responseData);
    throw new Error(responseData.message);
  }
};

export default setProfileFromGoogleSignup;
