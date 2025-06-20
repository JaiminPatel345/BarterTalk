import { jwtDecode } from "jwt-decode";
import axiosInstance from "../api/axiosInstance";

const setProfileFromGoogleLogin = async (data) => {
  const googleUser = jwtDecode(data.credential);
  const response = await axiosInstance.post(
    "/login?bygoogle=1",
    googleUser
  );
  if (response.status === 200 && response.data) {
    if (response.data.token) localStorage.setItem("token", response.data.token);
    return response.data;
  } else {
    throw new Error(response.data?.message || "Unknown error");
  }
};

export default setProfileFromGoogleLogin;
