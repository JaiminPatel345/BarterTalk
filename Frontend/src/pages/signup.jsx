import { Link, useNavigate } from "react-router-dom";
import GenderCheckbox from "../components/generateCheckbox";
import { useContext, useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import FlashMessageContext from "../context/flashMessageContext";
import AuthContext from "../context/authContext";
import { GoogleLogin } from "@react-oauth/google";
import setProfileFromGoogleSignup from "../hooks/setProfileFromGoogleSignup.js";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [gender, setGender] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);

  const { showSuccessMessage, showErrorMessage } =
    useContext(FlashMessageContext);
  const { setLogInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleSignup = async (googleUserData) => {
    try {
      const data = await setProfileFromGoogleSignup(googleUserData);
      if (data) {
        showSuccessMessage(`Welcome ${data.user.name}!`);
        setLogInUser(data.user);
        navigate("/profile");
      }
    } catch (error) {
      showErrorMessage(error.message || "Unknown error");
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);

    try {
      if (
        !formData.name ||
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        throw new Error("Fill all given fields");
      }
      if (!gender) {
        throw new Error("Select Gender");
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            password: formData.password,
            email: formData.email,
            gender,
          }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (response.ok) {
        showSuccessMessage(`Welcome ${formData.name}!`);
        setLogInUser(data.data);
        navigate("/profile");
      } else {
        throw new Error(data.message);
      }
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
          Sign Up to
          <span className="text-blue-600"> Barter Talk</span>
        </h1>

        {/*<button className="w-full py-2.5 px-4 mb-6 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">*/}
        {/*  <IconBrandGoogleFilled className="w-5 h-5" />*/}
        {/*  Continue with Google*/}
        {/*</button>*/}

        <div className={`w-full mb-5 flex items-center justify-center`}>
          <GoogleLogin
            text={`signup_with`}
            onSuccess={handleGoogleSignup}
            onError={(error) => {
              showErrorMessage(error.message || "Unknown error");
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
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              name="name"
              placeholder="Jaimin Detroja"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              name="username"
              placeholder="jaimin123"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              value={formData.email}
              name="email"
              placeholder="jaimin@gmail.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              name="password"
              placeholder="Enter Password"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <GenderCheckbox gender={gender} setGender={setGender} />

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={submitLoader}
          >
            {submitLoader ? (
              <HashLoader size={25} color="#ffffff" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div className={`text-md mt-10 text-center`}>
          <Link
            to="/login"
            className=" text-blue-600 hover:text-blue-800 hover:underline  "
          >
            {`Already have an account?`}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
