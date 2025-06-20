import { jwtDecode } from "jwt-decode";
import axiosInstance from "../api/axiosInstance";

const setProfileFromGoogleSignup = async (profile) => {
  const googleUser = jwtDecode(profile.credential);
  const response = await axiosInstance.post(
    "/signup?bygoogle=1",
    googleUser
  );
  if ((response.status === 201 || response.status === 222) && response.data) {
    if (response.data.token) localStorage.setItem("token", response.data.token);
    return response.data;
  } else {
    throw response.data;
  }
};

export default setProfileFromGoogleSignup;
