import User from "../models/user.js";
import generateToken from "./token.js";

const useGoogleLogin = async (googleUser, res) => {
  //find user in db
  const dbUser = await User.findOne({
    email: googleUser.email,
  });
  if (dbUser) {
    const token = generateToken(dbUser._id);
    return res.json({
      user: dbUser,
      token,
      message: "Login successfully",
    });
  }

  return res.status(400).json({
    message: "No user found , need to Signup",
  });
};

export default useGoogleLogin;
