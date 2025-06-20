import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { HashLoader } from "react-spinners";
import FlashMessageContext from "../context/flashMessageContext";
import { GoogleLogin } from "@react-oauth/google";
import setProfileFromGoogleLogin from "../hooks/setProfileFromGoogleLogin.js";
import useAuthStore from "../stores/useUser.js";
import { login as loginAPI } from "../api/auth";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [submitLoader, setSubmitLoader] = useState(false);

  const { showSuccessMessage, showErrorMessage } =
    useContext(FlashMessageContext);
  const { user, setLogInUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // showSuccessMessage("You are already logged in");
      navigate("/");
    }
  }, [user, navigate, showSuccessMessage]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleLogin = async (loginData) => {
    try {
      const data = await setProfileFromGoogleLogin(loginData);
      if (data) {
        showSuccessMessage(`Welcome ${data.user.name}!`);
        setLogInUser(data.user);
        if (data.token) localStorage.setItem("token", data.token);
      }
    } catch (error) {
      showErrorMessage(error.message || "Unknown error");
      console.log(error);
      navigate("/signup");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);

    try {
      if (!formData.username || !formData.password) {
        throw new Error("Fill all given fields");
      }

      const data = await loginAPI(formData);
      showSuccessMessage(`Welcome ${formData.username}!`);
      setLogInUser(data.user);
      if (data.token) localStorage.setItem("token", data.token);
    } catch (error) {
      showErrorMessage(error.message || "Unknown error");
      console.error(error);
    }
    setSubmitLoader(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-xl mx-auto px-4">
      <div className="w-full p-8 rounded-xl shadow-lg bg-[#FCF5EB]">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login to
          <span className="text-blue-600"> Barter Talk</span>
        </h1>

        {/*<button className="w-full py-2.5 px-4 mb-6 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">*/}
        {/*  <IconBrandGoogleFilled className="w-5 h-5" />*/}
        {/*  Continue with Google*/}
        {/*</button>*/}

        <div className={`w-full mb-5 flex items-center justify-center`}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => {
              console.log("error : ", error);
            }}
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={submitLoader}
          >
            {submitLoader ? <HashLoader size={25} color="#ffffff" /> : "Login"}
          </button>
        </form>
        <div className={`text-md mt-10 text-center`}>
          <Link to="/signup" className={"flex gap-3"}>
            <p className={"text-black"}>{`Don't have an account?`}</p>
            <p className=" text-blue-600 hover:text-blue-800 hover:underline  ">
              SIGNUP
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
