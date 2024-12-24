import User from "../models/user.js";
import generateTokenAndSetCookies from "./token.js";

const useGoogleLogin = async (googleUser, res) => {
  //find user in db
  const dbUser = await User.findOne({
    email: googleUser.email,
  });
  if (dbUser) {
    //generate token and set cookies
    generateTokenAndSetCookies(dbUser._id, res);
    return res.json({
      user: dbUser,
      message: "Login successfully",
    });
  }

  return res.status(400).json({
    message: "No user found , need to Signup",
  });
};

export default useGoogleLogin;
