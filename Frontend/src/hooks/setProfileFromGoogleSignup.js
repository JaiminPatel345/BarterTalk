import { jwtDecode } from "jwt-decode";

const setProfileFromGoogleSignup = async (profile) => {
  const googleUser = jwtDecode(profile.credential);
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/signup?bygoogle=1`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(googleUser),
      credentials: "include",
    },
  );
  const responseData = await response.json();
  if (response.ok) {
    return responseData;
  } else {
    throw responseData;
  }
};

export default setProfileFromGoogleSignup;
